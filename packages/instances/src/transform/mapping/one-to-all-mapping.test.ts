import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { RawInstances, initEntities } from '../../representation/raw-instances';
import {
    OneToAllMapping,
    getOneToAllMappingProperties,
    getOneToAllProperties,
} from './one-to-all-mapping';
import { createEntitySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Property Mappings', () => {
        describe('One-To-All', () => {
            test('getOneToAllProperties', () => {
                const targetInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    },
                ];

                const propertyInstances = getOneToAllProperties(targetInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getOneToAllMappingPropertyInstances', () => {
                const targetInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    },
                ];
                const mapping: OneToAllMapping = {
                    type: 'one-to-all-mapping',
                    source: createEntitySet({ id: '0', name: '0', properties: [] }),
                    target: createEntitySet({ id: '1', name: '1', properties: [] }),
                };
                const instances: RawInstances = {
                    entities: {
                        '0': initEntities(1),
                        '1': initEntities(targetInstances),
                    },
                    properties: {},
                };

                const propertyInstances = getOneToAllMappingProperties(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
