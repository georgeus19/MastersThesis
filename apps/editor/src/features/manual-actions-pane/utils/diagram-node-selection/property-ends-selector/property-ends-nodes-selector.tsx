import { EntitySet } from '@klofan/schema/representation';
import { DisplaySelect } from '../../display-select';

export type PropertyEndsNodesSelectorProps = {
    sourceEntity: EntitySet | null;
    targetEntity: EntitySet | null;
    onSourceSelectStart: () => void;
    onTargetSelectStart: () => void;
};

export function PropertyEndsNodesSelector({
    sourceEntity,
    targetEntity,
    onSourceSelectStart,
    onTargetSelectStart,
}: PropertyEndsNodesSelectorProps) {
    return (
        <div>
            <DisplaySelect
                label='Source'
                displayValue={sourceEntity?.name}
                onSelect={onSourceSelectStart}
            ></DisplaySelect>
            <DisplaySelect
                label='Target'
                displayValue={targetEntity?.name}
                onSelect={onTargetSelectStart}
            ></DisplaySelect>
        </div>
    );
}
