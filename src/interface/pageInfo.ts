type PageName =
  | 'organization'
  | 'site'
  | 'siteLocale'
  | 'warehouse'
  | 'product'
  | 'aggregator'
  | 'marketplace'
  | 'aggregatorMarketplace'
  | 'relationship'
  | 'assignedProduct'
  | 'user'
  | 'order'
  | 'listingStatus'
  | 'marketplaceRelationship'
  | 'mappings'
  | 'defaultPropertyValue'
  | 'productCategoryMappings'
  | 'productPropertyMappings'
  | 'courierMappings'
  | 'returnsrefunds'
  | 'deliveryTypeMappings'

interface IPageStoreInformation extends Record<PageName, Record<any, any>> {}

interface ISelectedItem {
  label: string
  value: string
}

export type ICurrentStatus = null | 'apply' | 'search'

export type IEventKey = 'filter-accordion' | '0'

export type {PageName, IPageStoreInformation, ISelectedItem}
