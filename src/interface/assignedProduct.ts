interface IAssignedMarketplaces {
  organizationIds: string[]
  siteIds: string[]
  siteLocaleIds: string[]
}

interface IBodyRequestAssignMarketplace {
  id: string
  version: number
  name: string
  assignedStatus: 'ASSIGNED' | 'UNASSIGNED' | 'BOTH'
}

interface IMarketPlacesAssignedProduct {
  id: string
  version: number
  erpId: string
  name: string
  isMarketplaceSynced?: boolean
}

interface IBodyRequestAssignedProducts {
  organizationId: string
  siteId: string
  siteLocaleId: string
  marketplaceIds: string[]
  search: string
  isAllMarketplaces: boolean
  isUnassignedMarketplaces: boolean
}

interface IBodyRequestAssignProductsToMarketplaces {
  organizationId: string
  siteId: string
  siteLocaleId: string
  productIds: string[]
  isAllProducts: boolean
  assignedMarketplace: IBodyRequestAssignMarketplace[]
}

interface IAssignedProducts {
  erpId: string
  id: string
  name: string
  createdAt: string
  modifiedAt: string
  version: number
  status: string
  marketplaces: IMarketPlacesAssignedProduct[]
}

export type {
  IAssignedMarketplaces,
  IBodyRequestAssignedProducts,
  IAssignedProducts,
  IBodyRequestAssignProductsToMarketplaces,
}