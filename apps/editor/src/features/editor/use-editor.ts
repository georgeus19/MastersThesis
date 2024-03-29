import { RawInstances } from '@klofan/instances/representation';
import { InMemoryInstances } from '@klofan/instances';
import { useNodeSelection } from '../diagram/use-node-selection';
import { Help, useHelp } from '../help/use-help';
import { Transformation } from '@klofan/transform';
import {
    ManualActionsPane,
    useManualActionsPane,
} from '../manual-actions-pane/use-manual-actions-pane';
import { usePositioning } from '../diagram/layout/use-positioning';
import { useNodeEvents } from '../diagram/node-events/use-node-events';
import { Instances } from '@klofan/instances';
import { useHistory } from './history/use-history';
import { UpdateHistoryOperation, UpdateOperation } from './history/update-history-operation.ts';
import { RawEditor } from './history/history';
import { reflectSchema } from '../diagram/reflect-schema/reflect-schema';
import { SchemaDiagram } from '../diagram/schema-diagram';
import { Schema } from '@klofan/schema';

/**
 * Api for accessing and manipulating editor data in the whole editor application.
 */
export type Editor = {
    history: {
        operations: UpdateHistoryOperation[];
        undo: () => void;
        redo: () => void;
    };
    schema: Schema;
    instances: Instances;
    diagram: SchemaDiagram;
    /**
     * Api for changing the right side manual action pane so that different components can be visualized.
     */
    manualActions: ManualActionsPane;
    /**
     * Api for showing help related to manual actions.
     */
    help: Help;
    /**
     * Update editor state using given operations but with only one batch state update.
     */
    runOperations: (operations: UpdateOperation[], mergeToOneUpdate?: boolean) => Promise<void>;
    /**
     * Transform schema and instances together and save their new state to history and take care
     * of any necessary changes to other data (such as updating diagram nodes, edges and positions.).
     */
    updateSchemaAndInstances: (transformation: Transformation) => Promise<void>;
    /**
     * Set new schema and instances forgetting the old new (they are still kept in history to get to using undo).
     * Any necessary updates (e.g. diagram) is done so caller does not need to handle anything else.
     */
    addSchemaAndInstances: (data: { schema: Schema; instances: Instances }) => void;
};

/**
 * Hook which encompasses main editor logic. It uses history, diagram, help, ... hooks together to provide simple way to update editor state from smaller components.
 */
export function useEditor(): Editor {
    const history = useHistory();
    const {
        current: { diagram: rawDiagram, schema: rawSchema, instances: rawInstances },
        update: updateHistory,
        undo,
        redo,
    } = history;

    const nodeSelection = useNodeSelection();

    const nodePositioning = usePositioning(history);

    const help = useHelp();

    const schema = new Schema(rawSchema);
    const instances = new InMemoryInstances(rawInstances);
    const manualActions = useManualActionsPane(nodeSelection, schema, help);
    const nodeEvents = useNodeEvents({
        diagram: rawDiagram,
        nodeSelection,
        manualActions,
        schema,
    });
    const diagram: SchemaDiagram = {
        ...rawDiagram,
        nodePositioning: nodePositioning,
        nodeEvents: nodeEvents,
        nodeSelection: nodeSelection,
    };

    /**
     * Transform schema and instances together and save their new state to history and take care
     * of any necessary changes to other data (such as updating diagram nodes, edges and positions.).
     */
    const updateSchemaAndInstances = (transformation: Transformation): Promise<void> => {
        return instances.transform(transformation.instanceTransformations).then((newInstances) => {
            const newSchema = schema.transform(transformation.schemaTransformations);
            updateHistory((currentEditor) => ({
                type: 'transform-schema-and-instances',
                transformation: transformation,
                updatedEditor: {
                    schema: newSchema.raw(),
                    instances: newInstances.raw() as RawInstances,
                    diagram: reflectSchema(currentEditor.diagram, newSchema),
                },
            }));
        });
    };

    /**
     * Set new schema and instances forgetting the old new (they are still kept in history to get to using undo).
     * Any necessary updates (e.g. diagram) is done so caller does not need to handle anything else.
     */
    const addSchemaAndInstances = ({
        schema,
        instances,
    }: {
        schema: Schema;
        instances: Instances;
    }) => {
        updateHistory((currentEditor) => ({
            type: 'import-schema-and-instances',
            schema: schema.raw(),
            instances: instances.raw() as RawInstances,
            updatedEditor: {
                schema: schema.raw(),
                instances: instances.raw() as RawInstances,
                diagram: reflectSchema(currentEditor.diagram, schema),
            },
        }));
    };

    /**
     * Update editor state using given operations but with only one batch state update.
     */
    const runOperations = async (operations: UpdateOperation[], mergeToOneUpdate?: boolean) => {
        let editor: RawEditor = { ...history.current };
        const operationsWithEditor: UpdateHistoryOperation[] = [];
        for (const operation of operations) {
            switch (operation.type) {
                case 'initial-operation':
                    break;
                case 'import-schema-and-instances':
                    editor = {
                        schema: operation.schema,
                        instances: operation.instances,
                        diagram: reflectSchema(editor.diagram, new Schema(operation.schema)),
                    };
                    break;
                case 'transform-schema-and-instances':
                    await new InMemoryInstances(editor.instances)
                        .transform(operation.transformation.instanceTransformations)
                        .then((newInstances) => {
                            const newSchema = new Schema(editor.schema).transform(
                                operation.transformation.schemaTransformations
                            );
                            editor = {
                                schema: newSchema.raw(),
                                instances: newInstances.raw() as RawInstances,
                                diagram: reflectSchema(editor.diagram, newSchema),
                            };
                        });
                    break;
                case 'auto-layout-diagram':
                case 'update-node-positions':
                    editor = {
                        ...editor,
                        diagram: await nodePositioning.updateDiagram(editor.diagram, operation),
                    };
                    break;
            }
            operationsWithEditor.push({ ...operation, updatedEditor: editor });
        }
        if (mergeToOneUpdate && operationsWithEditor.length > 0) {
            history.batchUpdate(() => [operationsWithEditor[operationsWithEditor.length - 1]]);
        } else {
            history.batchUpdate(() => operationsWithEditor);
        }
    };

    return {
        history: {
            operations: history.operations,
            undo: () => {
                manualActions.hide();
                undo();
            },
            redo: () => {
                manualActions.hide();
                redo();
            },
        },
        schema: schema,
        instances: instances,
        diagram: diagram,
        manualActions: manualActions,
        help: help,
        runOperations: runOperations,
        updateSchemaAndInstances: updateSchemaAndInstances,
        addSchemaAndInstances: addSchemaAndInstances,
    };
}
