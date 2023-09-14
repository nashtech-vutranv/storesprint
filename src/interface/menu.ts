interface IMenuItems {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: any
  children?: any
  parentKey?: string
  target?: React.HTMLAttributeAnchorTarget
}

export type MenuItemKey =
  | 'apps-management'
  | 'apps-organizations'
  | 'apps-site'
  | 'apps-locale'
  | 'apps-warehouse'
  | 'apps-products'
  | 'apps-product-properties'
  | 'apps-product-detail'
  | 'apps-marketplaces'
  | 'apps-marketplace-relationships'
  | 'apps-assigned-products'
  | 'apps-orders'
  | 'apps-order-detail'
  | 'apps-returnrefund'
  | 'apps-listing-status'
  | 'apps-default-property-values'
  | 'apps-product-category-mappings'
  | 'apps-product-property-mappings'
  | 'apps-marketplace-product-categories'
  | 'apps-courier-mappings'
  | 'apps-configuration'
  | 'app-users'
  | 'more'
  | 'apps-delivery-type-mappings'
  | 'apps-value-mappings'
  // For UPS menu
  | 'ups-application-setup'
  | 'ups-applications'
  | 'ups-modules'
  | 'ups-roles'
  | 'ups-permissions'
  | 'ups-organization-setup'
  | 'ups-organizations'
  | 'ups-sites'
  | 'ups-locales'
  | 'ups-user-management'
  | 'ups-users'
  | 'ups-user-permissions'
  | 'ups-roles-to-assign'

export type LabelKey =
  | 'management'
  | 'organizations'
  | 'warehouse'
  | 'products'
  | 'configuration'
  // | 'users'
  // | 'aggregators'
  | 'marketplaces'
  // | 'relationshipAM'
  | 'marketplaceRelationships'
  | 'assignedProducts'
  | 'orders'
  | 'listingStatus'
  | 'productProperties'
  | 'defaultPropertyValue'
  | 'productCategoryMappings'
  | 'courierMappings'
  | 'marketplaceProductCategories'
  | 'returnsRefunds'
  | 'deliveryTypeMappings'

export type LabelValue = {
  [key in LabelKey]: string
}

export type MenuItemType = {
  id?: number
  path?: string
  key: MenuItemKey
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  target?: string
  children?: MenuItemType[]
  permissions?: string[]
}

export type {IMenuItems}
