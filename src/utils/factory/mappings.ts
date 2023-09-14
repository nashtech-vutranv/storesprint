import faker from '@faker-js/faker'
import {
  IMappingType,
  IMappingMarketplace,
  IMappingTarget,
  IAddMappingResponse,
  IAddMappingTargetsResponse,
  IMarketplaceType,
  IMarketplaceMapping,
} from '../../interface/'

export const mockMappingTarget = (): IMappingTarget => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    marketplaceValue: [],
  }
}

export const mockMappingType = (): IMappingType => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    name: faker.datatype.string(),
  }
}

export const mockMappingTypesResponseData = (): IMappingType[] => {
  return Array.apply(null, Array(10)).map(() => mockMappingType())
}

export const mockMappingMarketplace = (): IMappingMarketplace => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    name: faker.datatype.string(),
  }
}

export const mockMappingMarketplaceResponseData = (): IMappingMarketplace[] => {
  return Array.apply(null, Array(10)).map(() => mockMappingMarketplace())
}

export const mockMappingAddResponseData = (): IAddMappingResponse => {
  return {
    id: faker.datatype.string(),
    marketplaceTypeId: faker.datatype.string(),
    mappingTypeId: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
  }
}

export const mockAddMappingTargetResponseData =
  (): IAddMappingTargetsResponse => {
    return Array.apply(null, Array(10)).map(() => ({
      id: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string(),
      mappingTypeId: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
    }))
  }

export const mockGetAllMappingMarketplaces = (): Array<
  Omit<IMarketplaceType, 'name'> & {name: string}
> => {
  return Array.apply(null, Array(10)).map(() => ({
    id: faker.datatype.string(),
    name: faker.datatype.string()
  }))
}

export const mockGetMarketplaceMapping: () => IMarketplaceMapping = () => {
  return {
    marketplaceTypeId: faker.datatype.string(),
    mappingTypeId: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
    marketplaceType: {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
    },
    mappingType: {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
    },
    mappingTarget: {
      id: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string(),
      mappingTypeId: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
    },
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}
