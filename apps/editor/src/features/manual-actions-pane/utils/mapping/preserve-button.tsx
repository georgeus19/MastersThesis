import { twMerge } from 'tailwind-merge';
import { Entity } from '@klofan/instances';
import { Property } from '@klofan/instances/representation';
import {
    getPreservedPropertyInstances,
    isPreserveMappingEligible,
    Mapping,
} from '@klofan/instances/transform';
import { LiteralSet, PropertySet, EntitySet } from '@klofan/schema/representation';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type PreserveButtonProps = {
    setEdges: (propertyInstances: Property[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    source: { entity: EntitySet; instances: Entity[] };
    target: { item: EntitySet; instances: Entity[] } | { item: LiteralSet };
    originalSource: { entity: EntitySet; instances: Entity[] };
    originalTarget: { item: EntitySet; instances: Entity[] } | { item: LiteralSet };
    property: PropertySet;
};

export function PreserveButton({
    setEdges,
    setUsedInstanceMapping,
    usedInstanceMapping,
    source,
    target,
    originalSource,
    originalTarget,
    property,
}: PreserveButtonProps) {
    const originalState = {
        source: { entity: originalSource.entity, instances: originalSource.instances.length },
        target:
            originalTarget.item.type === 'entity-set'
                ? {
                      item: originalTarget.item,
                      instances: (originalTarget as { item: EntitySet; instances: Entity[] })
                          .instances.length,
                  }
                : { item: originalTarget.item },
    };

    const newState = {
        source: { entity: source.entity, instances: source.instances.length },
        target:
            target.item.type === 'entity-set'
                ? {
                      item: target.item,
                      instances: (target as { item: EntitySet; instances: Entity[] }).instances
                          .length,
                  }
                : { item: target.item },
    };
    const disabled = !isPreserveMappingEligible(originalState, newState);
    const used = usedInstanceMapping.type === 'preserve-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getPreservedPropertyInstances(originalSource.instances, property));
                setUsedInstanceMapping({
                    type: 'preserve-mapping',
                    originalSource: originalSource.entity,
                    originalTarget: originalTarget.item,
                    property: property,
                    newSource: source.entity,
                    newTarget: target.item,
                });
            }}
            className={twMerge(
                'p-1 rounded shadow bg-blue-200 hover:bg-blue-300',
                disabled ? 'bg-slate-300 hover:bg-slate-300' : '',
                used ? 'bg-blue-600 hover:bg-blue-600 text-white' : ''
            )}
        >
            Preserve
        </button>
    );
}
