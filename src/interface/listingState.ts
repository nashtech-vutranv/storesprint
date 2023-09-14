import {IBaseEntities, IBaseEntitiesOmitNameAndErpId} from '.'

interface IListingState extends IBaseEntitiesOmitNameAndErpId {
  status: string
  errorCode?: string
  errorMessage: string
  listingsAction: string
  listedDate: string
  marketplace: Omit<IBaseEntities, 'createdAt' | 'modifiedAt'>
  product: IBaseEntities & {status: string}
  marketplaceProduct: IBaseEntities & {
    marketplaceProductCode?: string
    sellingPrice: string
    rrp: string
    listingQuantity: string
    deList?: string
  }
}

export type {IListingState}
