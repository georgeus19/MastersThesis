import { useCallback, useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { identifier } from '../../../../core/schema/utils/identifier';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertyTransformation } from '../../../../core/transform/factory/create-property-transformation';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Literal } from '../../../../core/instances/representation/literal';
import UpdatableLiteralTargetNode from '../../bipartite-diagram/nodes/updatable-literal-target-node';
import { useEntityInstanceToEntityInstanceDiagram } from '../../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { LayoutOptions } from '../../bipartite-diagram/layout';
import { useEditorContext } from '../../../editor/editor-context';

export type tabOption = 'literal' | 'entity';

export type LiteralNode = ReactFlowNode<
    { literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void; layout: LayoutOptions },
    identifier
> & {
    type: 'literal';
};
export type TargetLiteralEdge = ReactFlowEdge<never>;

export function useCreateProperty() {
    const [propertyName, setPropertyName] = useState('');
    const [tab, setTab] = useState<tabOption>('literal');
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const [targetEntity, setTargetEntity] = useState<Entity | null>(null);
    const [literalTargetNodes, setLiteralTargetNodes] = useState<LiteralNode[]>([]);
    const [literalTargetEdges, setLiteralTargetEdges] = useState<TargetLiteralEdge[]>([]);

    const {
        schema,
        updateSchemaAndInstances,
        help,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        manualActions: { onActionDone },
    } = useEditorContext();

    const {
        sourceNodes,
        targetNodes: entityTargetNodes,
        edges: entityTargetEdges,
        onConnect: onInstanceTargetConnect,
        layout,
        getPropertyInstances: getEntityInstanceTargetPropertyInstances,
    } = useEntityInstanceToEntityInstanceDiagram(sourceEntity, targetEntity, '');

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            if (nodeSelection.type === 'source') {
                setSourceEntity(selectedNode.data);
            } else {
                setTargetEntity(selectedNode.data);
            }
            help.hideHelp();

            if (sourceEntity || nodeSelection.type === 'source') {
                if (tab === 'entity' && (targetEntity || nodeSelection.type === 'target')) {
                    help.showEntityInstanceToEntityInstanceDiagramHelp();
                }
                if (tab === 'literal') {
                    help.showEntityInstanceToLiteralInstanceDiagramHelp();
                }
            }

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const getLiteralTargetPropertyInstances = () => {
        const sourceNodesMap = new Map(sourceNodes.map((node) => [node.id, node]));
        const literalTargetNodesMap = new Map(literalTargetNodes.map((node) => [node.id, node]));

        const propertyInstances: PropertyInstance[] = sourceNodes.map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [] }));

        literalTargetEdges.forEach((edge) => {
            const source = sourceNodesMap.get(edge.source);
            const literal = literalTargetNodesMap.get(edge.target);
            if (source && literal) {
                propertyInstances[source.data.entityInstance.id].literals.push(literal.data.literal);
            }
        });

        return propertyInstances;
    };

    const createProperty = () => {
        const propertyInstances = tab === 'entity' ? getEntityInstanceTargetPropertyInstances() : getLiteralTargetPropertyInstances();
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: tab === 'entity' ? { type: 'entity', entityId: targetEntity.id } : { type: 'literal' },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: propertyInstances,
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const onLiteralTargetConnect = useCallback(
        (connection: Connection) => setLiteralTargetEdges((eds) => addEdge(connection, eds) as unknown as TargetLiteralEdge[]),
        [setLiteralTargetEdges]
    );

    const changeLiteralValue = (literalNodeId: string, newValue: string) => {
        setLiteralTargetNodes((p) => {
            const node = p.find((node) => node.id === literalNodeId);
            return [
                ...p.filter((node) => node.id !== literalNodeId),
                {
                    ...node,
                    data: { ...node?.data, literal: { value: newValue } },
                } as LiteralNode,
            ];
        });
    };

    const addLiteralNode = () =>
        setLiteralTargetNodes((prev) => [
            ...prev,
            {
                id: `literal${prev.length}`,
                type: 'literal',
                position: { x: layout.node.targetX, y: layout.node.yIncrement * prev.length + layout.topPadding },
                data: {
                    literal: { value: '' },
                    onLiteralValueChange: changeLiteralValue,
                    layout,
                },
            },
        ]);

    const switchToEntityTargetTab = () => {
        help.hideHelp();
        clearSelectedNode();
        setNodeSelection(null);
        setTab('entity');
        if (sourceEntity && targetEntity) {
            help.showEntityInstanceToEntityInstanceDiagramHelp();
        }
    };

    const switchToLiteralTargetTab = () => {
        help.hideHelp();
        clearSelectedNode();
        setNodeSelection(null);
        setTab('literal');
        if (sourceEntity) {
            help.showEntityInstanceToLiteralInstanceDiagramHelp();
        }
    };

    return {
        diagram: {
            sourceNodes: sourceNodes,
            entityTarget: { targetNodes: entityTargetNodes, edges: entityTargetEdges, onConnect: onInstanceTargetConnect },
            literalTarget: {
                targetNodes: literalTargetNodes,
                edges: literalTargetEdges,
                onConnect: onLiteralTargetConnect,
                addLiteralNode: addLiteralNode,
            },
            nodeTypes: nodeTypes,
            edgeTypes: edgeTypes,
            layout: layout,
        },
        tab: {
            entityTabActive: tab === 'entity',
            literalTabActive: tab === 'literal',
            switchToEntityTargetTab: switchToEntityTargetTab,
            switchToLiteralTargetTab: switchToLiteralTargetTab,
        },
        nodeSelection: {
            onSourceNodeSelect: () => {
                help.showNodeSelectionHelp();
                setNodeSelection({ type: 'source' });
            },
            onTargetNodeSelect: () => {
                help.showNodeSelectionHelp();
                setNodeSelection({ type: 'target' });
            },
        },
        propertyName,
        sourceEntity,
        targetEntity,
        setPropertyName,
        createProperty,
        cancel,
    };
}
