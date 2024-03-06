import { useEffect, useState } from 'react';
import { useDiagramContext } from './diagram/diagram-context';
import { Property } from '@klofan/instances/representation';
import { Header } from '../manual-actions-pane/utils/header';
import { twMerge } from 'tailwind-merge';

export type ShownDetailProps = {
    height?: string;
};

export function ShownDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySelection },
        instances,
    } = useDiagramContext();

    const [propertyInstances, setPropertyInstances] = useState<Property[]>([]);

    useEffect(() => {
        if (propertySelection.selectedProperty) {
            instances
                .propertyInstances(propertySelection.selectedProperty.entity.id, propertySelection.selectedProperty.property.id)
                .then((propertyInstances) => setPropertyInstances(propertyInstances));
        }
    }, [propertySelection.selectedProperty]);

    if (!propertySelection.selectedProperty) {
        return <></>;
    }

    const ps = propertyInstances.map((propertyInstance, index) => (
        <div className='grid grid-cols-12 p-2 bg-slate-400 bg-opacity-60' key={index}>
            <div className='col-start-5'>Instance.{index}:</div>
            {propertyInstance.literals.map((literal, index) => (
                <div className='col-start-7 col-span-6' key={index}>
                    "{literal.value}"
                </div>
            ))}
        </div>
    ));
    return (
        <div className={'bg-slate-200'}>
            <Header
                className='text-lg bg-opacity-70'
                label={`${propertySelection.selectedProperty.entity.name}.${propertySelection.selectedProperty.property.name}`}
            ></Header>
            <div className={twMerge('flex flex-col gap-1 text-center overflow-auto', height)}>{ps}</div>
        </div>
    );
}
