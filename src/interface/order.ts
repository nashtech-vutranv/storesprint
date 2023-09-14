import {IBaseEntities, IBaseEntitiesOmitName, IBaseEntitiesOmitNameAndErpId} from '.'

interface IDeliveryAddress extends IBaseEntitiesOmitNameAndErpId {
  addressLine1: string
  postCode: string
  addressLine2?: string
  city?: string
  state?: string
  countryCode: string
  houseNumberOrName?: string
}

interface IOrderLine extends IBaseEntitiesOmitNameAndErpId {
  quantity: string
  price: string
  orderlineStatus: string
  taxAppliedPerUnit: string
  deliveryType: string
  product?: IBaseEntities
  marketplaceDeliveryService?: string
}

interface IOrderDetail extends IBaseEntitiesOmitName {
  aggregatorOrderReference?: string
  currency: string
  orderType: string
  orderCreatedAt?: string
  marketplacePurchaseDate?: string
  ecommerceModifiedAt?: string
  marketplaceOrderNumber: string
  orderStatus: string
  shippingCost: string
  deliveryAddress: IDeliveryAddress
  orderLines: IOrderLine[]
  totalAmount: string
  marketplace: {
    id: string
    marketplaceType: string
    name: string
    channelId: string
    currencyId: string
    erpId: string
    marketplaceTypeId: string
  }
}

interface IShipment extends IBaseEntitiesOmitNameAndErpId {
  shipmentNumber: string
  shipmentState: string
  trackingUrl: string
  despatchedDate: string
}

interface IShipments extends IBaseEntitiesOmitNameAndErpId {
  quantity: string
  product: IBaseEntities
  shipment: IShipment
}

interface IOrder extends Omit<IBaseEntities, 'name' | 'version'> {
  aggregatorOrderReference: string
  currency: string
  orderType: string
  orderCreatedAt: string
  marketplacePurchaseDate: string
  ecommerceModifiedAt: string
  marketplaceOrderNumber: string
  orderStatus: string
  shippingCost: string
  marketplace: {
    erpId: string
    name: string
    currencyId: string
    channelId: string
    marketplaceType: string
  }
}

interface IOrderReprocess {
  organizationIds: string[]
  siteIds: string[]
  siteLocaleIds: string[]
  marketplaceIds: string[]
  orderIds: string[]
  search: string
  statuses: string[]
  isAllOrder: boolean
}

export type {
  IOrderDetail,
  IOrderLine,
  IShipments,
  IDeliveryAddress,
  IOrder,
  IOrderReprocess,
}
