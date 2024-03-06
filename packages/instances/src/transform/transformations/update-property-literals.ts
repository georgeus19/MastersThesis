import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Literal } from '../../representation/literal';
import { TransformationChanges } from '../transformation-changes';

export interface UpdatePropertyLiterals {
    type: 'update-property-literals';
    data: {
        entity: EntitySet;
        property: PropertySet;
        literals:
            | {
                  type: 'value';
                  from: Literal;
                  to: Literal;
              }
            | {
                  type: 'pattern';
                  matchPattern: string;
                  replacementPattern: string;
              };
    };
}

export function updatePropertyLiterals(
    instances: RawInstances,
    transformation: UpdatePropertyLiterals
): void {
    const pk = propertyKey(transformation.data.entity.id, transformation.data.property.id);
    const transformationLiterals = transformation.data.literals;
    instances.properties[pk] = instances.properties[pk].map((propertyInstance) => {
        const updatedLiterals = propertyInstance.literals.map((literal) => {
            if (transformationLiterals.type === 'value') {
                return literal.value === transformationLiterals.from.value
                    ? { ...transformationLiterals.to }
                    : literal;
            } else {
                return {
                    ...literal,
                    value: literal.value.replace(
                        new RegExp(transformationLiterals.matchPattern),
                        transformationLiterals.replacementPattern
                    ),
                };
            }
        });
        return {
            ...propertyInstance,
            literals: updatedLiterals,
        };
    });
}

export function updatePropertyLiteralsChanges(
    transformation: UpdatePropertyLiterals
): TransformationChanges {
    return {
        entities: [transformation.data.entity.id],
        properties: [transformation.data.property.id],
    };
}
