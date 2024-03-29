import { describe, expect, test } from '@jest/globals';
import { RawInstances } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet } from '@klofan/schema/representation';
import { updateEntitiesUris, UpdateEntitiesUris } from './update-entities-uris';
import { createLiteral } from '../../representation/literal';

describe('@klofan/instances', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('updateEntitiesUris', async () => {
                const entitySetId = 'entitySetIDD';
                const buildingPropertySetId = 'BUILDINGpropertySetIDD';
                const IDpropertySetId = 'IDpropertySetId';
                const buildingPropertySet = createPropertySet({
                    id: buildingPropertySetId,
                    value: 'lit1',
                    name: `${buildingPropertySetId}Name`,
                });
                const idPropertySet = createPropertySet({
                    id: IDpropertySetId,
                    value: 'lit2',
                    name: `${IDpropertySetId}Name`,
                });

                const instances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {
                        [`${entitySetId}.${buildingPropertySetId}`]: [
                            {
                                literals: [
                                    createLiteral({ value: 'BANK' }),
                                    createLiteral({ value: 'P O S T  O F F I C E' }),
                                ],
                                targetEntities: [],
                            },
                            {
                                literals: [],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: 'POLICE-STATION' })],
                                targetEntities: [],
                            },
                        ],
                        [`${entitySetId}.${IDpropertySetId}`]: [
                            {
                                literals: [createLiteral({ value: '10' })],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: '20' })],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: '30' })],
                                targetEntities: [],
                            },
                        ],
                    },
                };
                const transformation: UpdateEntitiesUris = {
                    type: 'update-entities-uris',
                    data: {
                        entitySet: createEntitySet({
                            id: entitySetId,
                            name: 'entityset',
                            properties: [buildingPropertySetId, IDpropertySetId],
                        }),
                        uriPattern: [
                            {
                                type: 'uri-pattern-text-part',
                                text: 'http://example.com/',
                            },
                            {
                                type: 'uri-pattern-text-part',
                                text: 'buildings/',
                            },
                            {
                                type: 'uri-pattern-property-part',
                                propertySet: idPropertySet,
                            },
                            {
                                type: 'uri-pattern-text-part',
                                text: '/',
                            },
                            { type: 'uri-pattern-property-part', propertySet: buildingPropertySet },
                        ],
                    },
                };

                updateEntitiesUris(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [entitySetId]: [
                            { uri: 'http://example.com/buildings/10/BANK-P_O_S_T__O_F_F_I_C_E' },
                            { uri: 'http://example.com/buildings/20/' },
                            { uri: 'http://example.com/buildings/30/POLICE-STATION' },
                        ],
                    },
                    properties: {
                        [`${entitySetId}.${buildingPropertySetId}`]: [
                            {
                                literals: [
                                    createLiteral({ value: 'BANK' }),
                                    createLiteral({ value: 'P O S T  O F F I C E' }),
                                ],
                                targetEntities: [],
                            },
                            {
                                literals: [],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: 'POLICE-STATION' })],
                                targetEntities: [],
                            },
                        ],
                        [`${entitySetId}.${IDpropertySetId}`]: [
                            {
                                literals: [createLiteral({ value: '10' })],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: '20' })],
                                targetEntities: [],
                            },
                            {
                                literals: [createLiteral({ value: '30' })],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                expect(instances).toEqual(expectedInstances);
            });
        });
    });
});
