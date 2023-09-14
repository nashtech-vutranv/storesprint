import {
  IMarketplace,
  IMarketplaceType,
  IOrganization,
  ISite,
  ISiteLocale,
  IWarehouse,
} from './'

interface IBaseFormMarketplaceRelationshipEntity {
  version: number
  status: string
  organizationId: string
  marketplaceId: string
  aggregatorId: string
  siteId: string
  siteLocaleId: string
  warehouseIds: string[] | null
  stockMinimumLevel: number | string
  sellingPriceAdjustment: number | string
  isProductsReviewedBeforeListing: boolean
}

interface ISellerAccount {
  clientId?: string
  clientSecret?: string
  sellerId?: string
  refreshToken?: string
}

interface IMarketplaceRelationship {
  id: string
  createdAt?: string
  modifiedAt?: string
  version: number
  organizationId: string
  marketplaceId: string
  aggregatorId: string
  siteLocaleId: string
  status: string
  organization: IOrganization
  site: ISite
  siteLocale: ISiteLocale
  marketplace: IMarketplace
  marketplaceType: IMarketplaceType
  stockMinimumLevel: number
  sellingPriceAdjustment: number | null
  isProductsReviewedBeforeListing: boolean
  organizationWarehouse: IWarehouse[] | null
}

interface IQueryMarketplaceRelationship {
  organizationIds: string[]
  siteIds: string[]
  siteLocaleIds: string[]
  search: string
}

interface IFormMarketplaceRelationship
  extends IBaseFormMarketplaceRelationshipEntity,
    ISellerAccount {}

interface IFormRequestMarketplaceRelationship
  extends Omit<IBaseFormMarketplaceRelationshipEntity, 'siteId'> {
  sellerAccount: ISellerAccount | null
}

interface IUpdateMarketplaceRelationship extends IMarketplaceRelationship {
  organizationWarehouse: IWarehouse[]
  sellerAccount: ISellerAccount
}

export type {
  IMarketplaceRelationship,
  IQueryMarketplaceRelationship,
  IFormMarketplaceRelationship,
  IFormRequestMarketplaceRelationship,
  IUpdateMarketplaceRelationship,
}
