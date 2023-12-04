import { Handle, NodeProps, Position } from 'reactflow';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { Entity, getProperties } from '../../../../core/schema/representation/item/entity';
import { useSchemaContext } from '../../../schema-context';
import { EntityInstanceDetail } from '../../detail/entity-instance-detail';
import { twMerge } from 'tailwind-merge';
import { LayoutOptions } from '../layout';

export default function EntityInstanceSourceNode({ data }: NodeProps<{ entity: Entity; entityInstance: EntityInstance; layout: LayoutOptions }>) {
    const { schema } = useSchemaContext();
    const properties = getProperties(schema, data.entity.id);

    return (
        <>
            <div
                className={twMerge('bg-slate-200 p-2 rounded relative shadow group', data.layout.node.widthTailwind, data.layout.node.heightTailwind)}
            >
                <div className='overflow-clip'>
                    {data.entity.name}.{data.entityInstance.id}
                </div>
                <EntityInstanceDetail
                    entity={data.entity}
                    properties={properties}
                    entityInstance={data.entityInstance}
                    className='hidden absolute -right-52 left-0 p-2 top-10 group-hover:block bg-slate-100 overflow-visible'
                ></EntityInstanceDetail>
            </div>
            <Handle className='w-3 h-3' type='source' position={Position.Right} />
        </>
    );
}