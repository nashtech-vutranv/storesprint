interface IAssignMarketplace {
  organizationId: string
  siteId: string
  siteLocaleId: string
  marketplaceIds: string[]
  isAllProducts: boolean
}

interface IMarketplacesDialog {
  id: string
  version: number
  name: string
  assignedStatus: 'ASSIGNED' | 'UNASSIGNED' | 'BOTH' | null,
  createdAt?: string
  modifiedAt?: string
}

interface IRequestBodyCalculateAssignMarketplaces extends IAssignMarketplace {
  isUnassignedMarketplace: boolean
  productIds: string[]
}

export type {IAssignMarketplace, IMarketplacesDialog, IRequestBodyCalculateAssignMarketplaces}