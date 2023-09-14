import {IBaseEntities} from './common'
import {IMarketplace} from './marketplace'
import {IAggregator} from './aggregator'

interface IRequestReturnsRefunds {
  organizationIds: string[]
  siteIds: string[]
  siteLocaleIds: string[]
  marketplaceIds: string[]
  returnOrderStatuses: string[]
  search: string
}

interface IReturnRefundOrder extends IBaseEntities {
  aggregatorOrderReference: string,
  currency: string,
  orderType: string,
  marketplacePurchaseDate: string,
  ecommerceModifiedAt: string,
  marketplaceOrderNumber: string,
  orderStatus: string,
  shippingCost: string
}

interface IReturnRefund extends IBaseEntities {
  order: IReturnRefundOrder,
  marketplaceName: string,
  requestedDate: string,
  modifiedDate: string,
  returnStatus: string
}

type IReturnsRefunds = IReturnRefund[]

interface IReturnRefundAssignMarketplace extends IMarketplace {
  marketplaceType: {
    id: string
    name: string
    aggregator: IAggregator
  }
}

export type {IRequestReturnsRefunds, IReturnRefund, IReturnsRefunds, IReturnRefundAssignMarketplace}