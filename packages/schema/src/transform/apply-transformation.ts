import { RawSchema } from '../representation/raw-schema';
import { createEntitySet } from './transformations/create-entity-set';
import { createLiteralSet } from './transformations/create-literal-set';
import { createPropertySet } from './transformations/create-property-set';
import { movePropertySet } from './transformations/move-property-set';
import { Transformation } from './transformations/transformation';
import { updateEntitySet } from './transformations/update-entity-set';
import { updateItem } from './transformations/update-item';
import { updateRelation } from './transformations/update-relation';
import { deletePropertySet } from './transformations/delete-property-set';
import { deleteEntitySet } from './transformations/delete-entity-set';

export function applyTransformation(schema: RawSchema, transformation: Transformation) {
    switch (transformation.type) {
        case 'update-item':
            updateItem(schema, transformation);
            break;
        case 'update-entity-set':
            updateEntitySet(schema, transformation);
            break;
        case 'update-relation':
            updateRelation(schema, transformation);
            break;
        case 'create-entity-set':
            createEntitySet(schema, transformation);
            break;
        case 'create-literal-set':
            createLiteralSet(schema, transformation);
            break;
        case 'create-property-set':
            createPropertySet(schema, transformation);
            break;
        case 'move-property-set':
            movePropertySet(schema, transformation);
            break;
        case 'delete-property-set':
            deletePropertySet(schema, transformation);
            break;
        case 'delete-entity-set':
            deleteEntitySet(schema, transformation);
            break;
    }
}
