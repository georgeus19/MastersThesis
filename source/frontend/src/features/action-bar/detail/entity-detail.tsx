import { useEffect, useState } from 'react';
import { Entity, getProperties } from '../../../core/schema/representation/item/entity';
import { useSchemaContext } from '../../schema-context';
import { createUpdateItemNameTransformation } from '../../../core/transform/factory/update-item-name-transformation';

import { DetailLabelValueItem } from '../utils/detail-label-value-item';
import { Dropdown } from '../utils/dropdown';
import { createUpdateRelationNameTransformation } from '../../../core/transform/factory/update-relation-name-transformation';
import { createUpdatePropertyUriTransformation } from '../../../core/transform/factory/update-property-uri-transformation';
import { isLiteral } from '../../../core/schema/representation/item/literal';
import { GraphProperty, toProperty } from '../../../core/schema/representation/relation/graph-property';
import { useActionContext } from '../action-context';
import { useInstancesContext } from '../../instances-context';
import { EntityInstance } from '../../../core/instances/entity-instance';
import { identifier } from '../../../core/schema/utils/identifier';
import { createUpdateEntityUriTransformation } from '../../../core/transform/factory/update-entity-uri-transformation';

export interface EntityDetailProps {
    entity: Entity;
}

export function EntityDetail({ entity }: EntityDetailProps) {
    const [entityInstances, setEntityInstances] = useState<EntityInstance[]>([]);
    const [entityInstanceForEntity, setEntityInstanceForEntity] = useState<identifier>(entity.id);

    const { showMoveProperty } = useActionContext();

    const { schema, updateSchema } = useSchemaContext();
    const { instances } = useInstancesContext();
    const properties = getProperties(schema, entity.id);

    useEffect(() => {
        instances.entityInstances(entity).then((entityInstances) => {
            setEntityInstances(entityInstances);
            setEntityInstanceForEntity(entity.id);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);

    const handleEntityNameChange = (name: string) => {
        const transformation = createUpdateItemNameTransformation(schema, entity.id, name);
        updateSchema(transformation.schemaTransformations);
    };

    const handleEntityUriChange = (uri: string) => {
        const transformation = createUpdateEntityUriTransformation(schema, entity.id, uri);
        updateSchema(transformation.schemaTransformations);
    };

    const generatePropertyDetail = (property: GraphProperty) => (
        <li className='border border-slate-300 rounded shadow decoration-double my-1 text-lg' key={property.id}>
            <div className='bg-slate-600 text-white p-1'>{property.name}</div>
            <DetailLabelValueItem
                id={`${property.id}name`}
                label='Name'
                initialValue={property.name}
                onChangeDone={(name: string) => {
                    const transformation = createUpdateRelationNameTransformation(schema, property.id, name);
                    updateSchema(transformation.schemaTransformations);
                }}
            ></DetailLabelValueItem>
            <DetailLabelValueItem
                id={`${property.id}uri`}
                label='Uri'
                initialValue={property.uri ?? ''}
                onChangeDone={(uri: string) => {
                    const transformation = createUpdatePropertyUriTransformation(schema, property.id, uri);
                    updateSchema(transformation.schemaTransformations);
                }}
            ></DetailLabelValueItem>
            <button
                className='col-span-2 p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={() => showMoveProperty(entity, toProperty(property))}
            >
                Move
            </button>
        </li>
    );

    return (
        <div>
            <Dropdown headerLabel='General' showInitially={true}>
                <DetailLabelValueItem
                    id='entityName'
                    initialValue={entity.name}
                    onChangeDone={handleEntityNameChange}
                    label='Name'
                ></DetailLabelValueItem>
                <DetailLabelValueItem
                    id='entityUri'
                    initialValue={entity.uri ?? ''}
                    onChangeDone={handleEntityUriChange}
                    label='Uri'
                ></DetailLabelValueItem>
            </Dropdown>

            <Dropdown headerLabel='Properties' showInitially={false}>
                <Dropdown className='mx-2' headerLabel='Literal' showInitially={false}>
                    <ul className='mx-4'>
                        {properties.filter((property) => isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
                <Dropdown className='mx-2' headerLabel='Other' showInitially={false}>
                    <ul className='mx-4'>
                        {properties.filter((property) => !isLiteral(property.value)).map((property) => generatePropertyDetail(property))}
                    </ul>
                </Dropdown>
            </Dropdown>

            {entityInstanceForEntity === entity.id && (
                <Dropdown headerLabel='Instance' showInitially={false}>
                    <div className='flex flex-col'>
                        {entityInstances.map((entityInstance, instanceIndex) => {
                            return (
                                <Dropdown className='mx-2' headerLabel={`${entity.name}.${instanceIndex}`} showInitially={false}>
                                    <div className='mx-4 grid grid-cols-3 items-center gap-1'>
                                        <div className='bg-slate-300 overflow-auto p-2 text-center'>
                                            {entity.name}.{instanceIndex}
                                        </div>
                                        {properties
                                            .filter(
                                                (property) =>
                                                    entityInstance.properties[property.id].literals.length > 0 ||
                                                    entityInstance.properties[property.id].targetInstanceIndices.length > 0
                                            )
                                            .map((property) => {
                                                return (
                                                    <>
                                                        <div className='col-start-2 overflow-auto p-2 bg-slate-300 text-center'>{property.name}</div>
                                                        {entityInstance.properties[property.id].literals.map((literal) => (
                                                            <div className='col-start-3 overflow-auto p-2 bg-blue-300 text-center'>
                                                                "{literal.value}"
                                                            </div>
                                                        ))}
                                                        {entityInstance.properties[property.id].targetInstanceIndices.map((targetInstanceIndex) => (
                                                            <div className='col-start-3 overflow-auto p-2 bg-purple-200 text-center'>
                                                                {property.value.name}.{targetInstanceIndex}
                                                            </div>
                                                        ))}
                                                    </>
                                                );
                                            })}
                                    </div>
                                </Dropdown>
                            );
                        })}
                    </div>
                </Dropdown>
            )}
        </div>
    );
}