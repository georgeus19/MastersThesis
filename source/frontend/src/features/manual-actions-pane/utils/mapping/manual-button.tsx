import { twMerge } from 'tailwind-merge';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Mapping } from '../../../../core/instances/transform/mapping/mapping';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type ManualButtonProps = {
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    setEdges: (propertyInstances: PropertyInstance[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
};

export function ManualButton({ setEdges, setUsedInstanceMapping, usedInstanceMapping }: ManualButtonProps) {
    const used = usedInstanceMapping.type === 'manual-mapping';
    return (
        <button
            onClick={() => {
                setEdges([]);
                setUsedInstanceMapping({ type: 'manual-mapping', propertyInstances: [] });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', used ? 'bg-blue-600 hover:bg-blue-600 text-white' : '')}
        >
            Manual
        </button>
    );
}