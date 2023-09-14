interface IAssignedMarketplaceInProduct {
  id: string
  version: number
  name: string
  assignedStatus: 'ASSIGNED' | 'UNASSIGNED' | 'BOTH'
}

interface IBodyRequestAssignProductsMarketplaces {
  organizationId: string
  siteId: string
  siteLocaleId: string
  productIds: string[]
  isAllProducts: boolean
  assignedMarketplace: IAssignedMarketplaceInProduct[]
}

export type {IBodyRequestAssignProductsMarketplaces}