import { CreateEntities, CreateEntitiesOptions } from '@klofan/instances/transform';
import { createEntitySet, EntitySet } from '@klofan/schema/representation';
import { CreateEntitySet } from '@klofan/schema/transform';
import { getNewId } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createCreateEntitySetTransformation({
    schema: { name, id },
    instances,
}: {
    schema: { name: string; id?: string };
    instances: CreateEntitiesOptions;
}): Transformation {
    const entitySet: EntitySet = createEntitySet({
        id: id ? id : getNewId(),
        name: name,
        properties: [],
    });
    const createEntitySetTransformation: CreateEntitySet = {
        type: 'create-entity-set',
        data: { entitySet: entitySet },
    };

    const createEntitiesTransformation: CreateEntities = {
        type: 'create-entities',
        data: {
            entitySet: entitySet,
            entities: instances,
        },
    };

    return {
        schemaTransformations: [createEntitySetTransformation],
        instanceTransformations: [createEntitiesTransformation],
    };
}
