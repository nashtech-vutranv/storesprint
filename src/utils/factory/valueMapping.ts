import faker from '@faker-js/faker'
import {
  IValueMappingsResponse,
  IValueMappingResponse,
  IUpdateValueMappingRequest,
} from '../../interface'

export const mockEnumValueMapping = (): IValueMappingResponse => {
  return ({
    mappingTarget: {
      id: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string(),
      mappingTypeId: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
    },
    mappings: [
      {
        id: faker.datatype.string(),
        createdAt: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        version: faker.datatype.number(),
        marketplaceTypeId: faker.datatype.string(),
        mappingTypeId: faker.datatype.string(),
        mmsValue: faker.datatype.string(),
        marketplaceValue: faker.datatype.string()
      },
    ]
  })
  }

export const mockEnumValueMappings = (): IValueMappingsResponse => {
  return Array.from(new Array(2)).map(() => mockEnumValueMapping())
}

export const mockGetMMSProductPropertyValues = (): string[] =>
  Array.from(new Array(2)).map(() => faker.datatype.string())

export const mockUpdateEnumValueMapping = (): IUpdateValueMappingRequest => {
  return {
    marketplaceTypeId: faker.datatype.string(),
    mappingTypeId: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
    mmsValues: [
      faker.datatype.string(),
      faker.datatype.string(),
      faker.datatype.string(),
    ],
    marketplaceCode: faker.datatype.string(),
  }
}
