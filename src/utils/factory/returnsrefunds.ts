import faker from '@faker-js/faker'
import {
  IReturnsRefunds,
  IReturnRefund,
  IReturnRefundAssignMarketplace,
} from '../../interface'

export const mockReturnRefund: () => IReturnRefund = () => {
  return {
    id: faker.datatype.string(),
    erpId: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    name: faker.datatype.string(),
    version: faker.datatype.number(),
    order: {
      id: faker.datatype.string(),
      erpId: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      name: faker.datatype.string(),
      version: faker.datatype.number(),
      aggregatorOrderReference: faker.datatype.string(),
      currency: faker.datatype.string(),
      orderType: faker.datatype.string(),
      marketplacePurchaseDate: faker.datatype.string(),
      ecommerceModifiedAt: faker.datatype.string(),
      marketplaceOrderNumber: faker.datatype.string(),
      orderStatus: faker.datatype.string(),
      shippingCost: faker.datatype.string(),
    },
    marketplaceName: faker.datatype.string(),
    requestedDate: faker.datatype.string(),
    modifiedDate: faker.datatype.string(),
    returnStatus: faker.datatype.string(),
  }
}

export const mockReturnsRefunds: () => IReturnsRefunds = () => {
  return Array.apply(null, Array(10)).map(() => mockReturnRefund())
}

export const mockOrderReturnStatus: () => string[] = () => {
  return Array.apply(null, Array(10)).map(() => faker.datatype.string())
}

export const mockReturnRefundAssignedMarketplace = (): IReturnRefundAssignMarketplace => {
  return {
    id: faker.datatype.string(),
    name: faker.datatype.string(),
    status: faker.datatype.string(),
    currencyId: faker.datatype.string(),
    version: faker.datatype.number(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    currency: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      version: faker.datatype.number(),
      name: faker.datatype.string(),
    },
    marketplaceType: {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
      aggregator: {
        id: faker.datatype.string(),
        name: faker.datatype.string(),
        version: faker.datatype.number(),
        status: faker.datatype.string(),
        createdAt: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
      }
    }
  }
}

export const mockReturnRefundAssignedMarketplaces: () => IReturnRefundAssignMarketplace[] =
  () => {
    return Array.apply(null, Array(10)).map(() =>
      mockReturnRefundAssignedMarketplace()
    )
  }

