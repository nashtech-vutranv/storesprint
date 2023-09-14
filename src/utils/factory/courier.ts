import faker from '@faker-js/faker'
import {ICourierMapping} from '../../interface'

export const mockCourier = (): ICourierMapping => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    version: faker.datatype.number(),
    mappingTarget: {
        id: faker.datatype.string(),
        mappingTypeId: faker.datatype.string(),
        marketplaceCode: faker.datatype.string(),
        marketplaceTypeId: faker.datatype.string(),
        marketplaceValue: faker.datatype.string(),
    },
    mappingType: {
        id: faker.datatype.string(),
        name: faker.datatype.string(),
    },
    mappingTypeId: faker.datatype.string(),
    marketplaceType: {
        id: faker.datatype.string(),
        name: faker.datatype.string(),
    },
    marketplaceTypeId: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
  }
}

export const mockCouriers = (): ICourierMapping[] => {
    return Array.apply(null, Array(10)).map(() =>mockCourier()) 
}
