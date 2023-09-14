import faker from '@faker-js/faker'
import {
  IDeliveryAddress,
  IOrder,
  IOrderDetail,
  IOrderLine,
  IShipments,
} from '../../interface/order'

export const mockOrderline = (): IOrderLine => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    deliveryType: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    orderlineStatus: faker.datatype.string(),
    price: faker.datatype.string(),
    quantity: faker.datatype.string(),
    taxAppliedPerUnit: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}

export const mockDeliveryAddress = (): IDeliveryAddress => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    addressLine1: faker.datatype.string(),
    countryCode: faker.datatype.string(),
    postCode: faker.datatype.string(),
    addressLine2: faker.datatype.string(),
    city: faker.datatype.string(),
    houseNumberOrName: faker.datatype.string(),
    state: faker.datatype.string(),
  }
}

export const mockShipment = (): IShipments => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    product: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      version: faker.datatype.number(),
      erpId: faker.datatype.string(),
      name: faker.datatype.string(),
    },
    quantity: faker.datatype.string(),
    shipment: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      version: faker.datatype.number(),
      despatchedDate: faker.datatype.string(),
      shipmentNumber: faker.datatype.string(),
      shipmentState: faker.datatype.string(),
      trackingUrl: faker.datatype.string(),
    },
  }
}

export const mockMultipleShipment = () => {
  return Array.apply(null, Array(10)).map(() => mockShipment())
}

export const mockOrderLines = () => {
  return Array.apply(null, Array(10)).map(() => mockOrderline())
}

export const mockOrderDetail = (): IOrderDetail => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    currency: faker.datatype.string(),
    erpId: faker.datatype.string(),
    marketplaceOrderNumber: faker.datatype.string(),
    orderStatus: faker.datatype.string(),
    orderType: faker.datatype.string(),
    shippingCost: faker.datatype.string(),
    aggregatorOrderReference: faker.datatype.string(),
    ecommerceModifiedAt: faker.datatype.string(),
    orderCreatedAt: faker.datatype.string(),
    marketplacePurchaseDate: faker.datatype.string(),
    orderLines: Array.apply(null, Array(10)).map(() => mockOrderline()),
    deliveryAddress: mockDeliveryAddress(),
    totalAmount: faker.datatype.string(),
    marketplace: {
      channelId: faker.datatype.string(),
      currencyId: faker.datatype.string(),
      erpId: faker.datatype.string(),
      id: faker.datatype.string(),
      marketplaceType: faker.datatype.string(),
      name: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string()
    }
  }
}

export const mockOrder = (): IOrder => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    currency: faker.datatype.string(),
    erpId: faker.datatype.string(),
    marketplaceOrderNumber: faker.datatype.string(),
    orderStatus: faker.datatype.string(),
    orderType: faker.datatype.string(),
    shippingCost: faker.datatype.string(),
    aggregatorOrderReference: faker.datatype.string(),
    ecommerceModifiedAt: faker.datatype.string(),
    orderCreatedAt: faker.datatype.string(),
    marketplacePurchaseDate: faker.datatype.string(),
    marketplace: {
      channelId: faker.datatype.string(),
      currencyId: faker.datatype.string(),
      erpId: faker.datatype.string(),
      marketplaceType: faker.datatype.string(),
      name: faker.datatype.string(),
    },
  }
}

export const mockOrders = () => {
  return Array.apply(null, Array(10)).map(() => mockOrder())
}
