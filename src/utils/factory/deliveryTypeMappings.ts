import faker from '@faker-js/faker'
import {IDeliveryTypeMapping} from '../../interface'

export const mockDeliveryTypeMapping = (): IDeliveryTypeMapping => ({
  id: faker.datatype.string(),
  marketplaceValue: faker.datatype.string(),
  mmsValue: faker.datatype.string(),
})

export const mockDeliveryTypeMappings = () => {
  return Array.apply(null, Array(10)).map(() => mockDeliveryTypeMapping())
}

export const mockMarketplaceDeliveryService = () => {
    return Array.apply(null, Array(10)).map(() => ({
        id: faker.datatype.string(),
        mappingTypeId: faker.datatype.string(),
        marketplaceTypeId: faker.datatype.string(),
        marketplaceValue: faker.datatype.string(),
        marketplaceCode: faker.datatype.string()
    }))
  }
  
