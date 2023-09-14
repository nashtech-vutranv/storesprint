import faker from '@faker-js/faker'
import {IListingState} from '../../interface/listingState'

export const mockListingStatus = (): IListingState => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    errorMessage: faker.datatype.string(),
    listedDate: faker.datatype.string(),
    listingsAction: faker.datatype.string(),
    marketplace: {
      erpId: faker.datatype.string(),
      id: faker.datatype.string(),
      name: faker.datatype.string(),
      version: faker.datatype.number(),
    },
    status: faker.datatype.string(),
    errorCode: faker.datatype.string(),
    marketplaceProduct: {
      createdAt: faker.datatype.string(),
      erpId: faker.datatype.string(),
      id: faker.datatype.string(),
      listingQuantity: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      name: faker.datatype.string(),
      rrp: faker.datatype.string(),
      sellingPrice: faker.datatype.string(),
      version: faker.datatype.number(),
      deList: faker.datatype.string(),
      marketplaceProductCode: faker.datatype.string(),
    },
    product: {
      erpId: faker.datatype.string(),
      id: faker.datatype.string(),
      name: faker.datatype.string(),
      version: faker.datatype.number(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      status: faker.datatype.string(),
    },
  }
}

export const mockListingStatuses = () => {
  return Array.apply(null, Array(10)).map(() => mockListingStatus())
}
