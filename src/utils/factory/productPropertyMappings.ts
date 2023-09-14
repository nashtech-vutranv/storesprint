import faker from '@faker-js/faker'
import {IProductPropertyMappings} from '../../interface'

export const mockProductPropertyMappings = (): IProductPropertyMappings => {
  return {
    attributeResponse: {
        attributeType: faker.datatype.string(),
        createdAt: faker.datatype.string(),
        description: faker.datatype.string(),
        id: faker.datatype.string(),
        isEnum: faker.datatype.boolean(),
        isMandatory: faker.datatype.boolean(),
        mappingTypeId: faker.datatype.string(),
        marketplaceTypeId: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        status: faker.datatype.string(),
        value: faker.datatype.string(),
        version: faker.datatype.number(),
        locale: faker.datatype.string(),
        marketplaceCode: faker.datatype.string()
    },
    mappingResponse: {
        createdAt: faker.datatype.string(),
        id: faker.datatype.string(),
        mappingTypeId: faker.datatype.string(),
        marketplaceTypeId: faker.datatype.string(),
        marketplaceValue: faker.datatype.string(),
        mmsValue: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        version: faker.datatype.number()
    },
    propertyResponse: {
        createdAt: faker.datatype.string(),
        id: faker.datatype.string(),
        name: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        version: faker.datatype.number(),
        erpId: faker.datatype.string(),
        type: faker.datatype.string(),
        localeSensitive: faker.datatype.boolean(),
    }
  }
}

export const mockListProductPropertyMappings = () => {
  return Array.from(new Array(2)).map(() => mockProductPropertyMappings())
}

export const mockUpdateProductPropertyMapping = () => {
  return {
    createdAt: faker.datatype.string(),
    id: faker.datatype.string(),
    mappingTypeId: faker.datatype.string(),
    marketplaceTypeId: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}
