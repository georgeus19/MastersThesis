/**
 * Represents the mapping which entity instances of given property link to target entity instances.
 *
 * The source entity and target entity may not have the same number of instances.
 * If property is moved, added, etc..., some sort of mapping must be specified.
 */
export interface InstanceMapping {
    mappedInstances(source: number): number[];
}

export class AllToOneInstanceMapping implements InstanceMapping {
    constructor(
        private source: number,
        private target: number[]
    ) {}

    mappedInstances(source: number): number[] {
        if (this.source === source) {
            return this.target;
        }
        return [];
    }
}
