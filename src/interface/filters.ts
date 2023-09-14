export interface IProductsFilter {
  organizationIds: string[]
  siteIds: string[]
  siteLocaleIds: string[]
  search: string
}

export interface ISitesFilter {
  organizationIds: string[]
  isReviewProduct?: boolean
}

export interface ISiteLocalesFilter {
  siteIds: string[]
  isReviewProduct?: boolean
}

export interface IWarehousesFilter {
  organizationIds: string[]
  search: string
}

export interface IUsersFilter {
  orgId: string | null
  siteIds: string[] | null
  keyword: string | null
}

export interface IOrdersFilter extends IProductsFilter {
  statuses: string[]
  marketplaceIds: string[]
}

export interface IListingStateFilter {
  organizationId: string
  siteId: string
  siteLocaleId: string
  marketplaceIds: string[]
  statuses: string[]
  search: string
}

export interface IProductPropertiesFilter {
  search: string
}

export interface IDefaultPropertyValueFilter {
  organizationIds: string[]
  propertyIds: string[]
  localeIds: string[]
  search: string
}

export interface IProductCategoryMappingsFilter {
  organizationId: string
  mmsProductCategory: string
  marketplaceTypeId: string
  search: string
  isUnMapped: boolean
}

export interface IProductPropertyMappingsFilter {
  marketplaceTypeId: string
  mappingTargetId: string
  search: string
}

export interface ICourierMappingsFilter {
  marketplaceTypeId: string
  search: string
}

export interface IDeliveryTypeMappingsFilter {
  marketplaceTypeId: string
  search: string
}