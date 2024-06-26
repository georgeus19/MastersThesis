export type { Transformation } from '../transform/transformations/transformation';

export type { AllToOneMapping } from '../transform/mapping/all-to-one-mapping';
export {
    getAllToOneProperties,
    isAllToOneMappingEligible,
} from '../transform/mapping/all-to-one-mapping';
export type { JoinMapping } from '../transform/mapping/join-mapping';
export { getJoinedProperties } from '../transform/mapping/join-mapping';
export type { ManualMapping } from '../transform/mapping/manual-mapping';
export type { Mapping } from '../transform/mapping/mapping';
export type { OneToAllMapping } from '../transform/mapping/one-to-all-mapping';
export {
    getOneToAllProperties,
    isOneToAllMappingEligible,
} from '../transform/mapping/one-to-all-mapping';
export type { OneToOneMapping } from '../transform/mapping/one-to-one-mapping';
export {
    getOneToOneProperties,
    isOneToOneMappingEligible,
} from '../transform/mapping/one-to-one-mapping';
export type {
    EntitySetWithInstances,
    ItemWithInstances,
    PreserveMapping,
} from '../transform/mapping/preserve-mapping';
export {
    getPreservedProperties,
    isPreserveMappingEligible,
} from '../transform/mapping/preserve-mapping';

export type {
    CreateEntities,
    CreateEntitiesOptions,
} from '../transform/transformations/create-entities';
export { createEntities } from '../transform/transformations/create-entities';
export type { CreateProperties } from '../transform/transformations/create-properties';
export { createProperties } from '../transform/transformations/create-properties';
export type { MoveProperties } from '../transform/transformations/move-properties';
export { moveProperties } from '../transform/transformations/move-properties';
export type {
    UriPatternPart,
    UriPatternTextPart,
    UriPatternPropertyPart,
    UpdateEntitiesUris,
} from '../transform/transformations/update-entities-uris';
export {
    updateEntitiesUris,
    constructUri,
} from '../transform/transformations/update-entities-uris';
export type { UpdatePropertyLiterals } from '../transform/transformations/update-property-literals';
export { updatePropertyLiterals } from '../transform/transformations/update-property-literals';

export type { ConvertLiteralToEntity } from '../transform/transformations/convert-literal-to-entity';
export { convertLiteralToEntity } from '../transform/transformations/convert-literal-to-entity';

export type { DeleteLiterals } from '../transform/transformations/delete-literals';
export { deleteLiterals } from '../transform/transformations/delete-literals';

export type { DeleteEntities } from '../transform/transformations/delete-entities';
export { deleteEntities } from '../transform/transformations/delete-entities';

export type { DeleteProperties } from '../transform/transformations/delete-properties';
export { deleteProperties } from '../transform/transformations/delete-properties';

export type { TransformationChanges } from '../transform/transformation-changes';
export { transformationChanges } from '../transform/transformation-changes';
