import { UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Transformation } from '../transformation';
import { Entity, Property } from '@klofan/schema/representation';
import { Literal } from '@klofan/instances/representation';

export function createUpdatePropertyLiteralsValueTransformation(data: {
    entity: Entity;
    property: Property;
    literals: {
        from: Literal;
        to: Literal;
    };
}): Transformation {
    const updateEntityInstanceUrisTransformation: UpdatePropertyLiterals = {
        type: 'update-property-literals',
        data: { ...data, literals: { ...data.literals, type: 'value' } },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntityInstanceUrisTransformation],
    };
}