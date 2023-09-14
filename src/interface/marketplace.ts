import {ICurrency} from './'

interface IMarketplace {
  id: string
  name: string
  status: string
  currencyId: string
  version: number
  createdAt?: string
  modifiedAt?: string
  currency?: ICurrency
}

interface IMarketplaceType {
  id: string
  name: 'Tiktok' | 'Amazon' | null
  aggregator?: any
}

interface IUnAssignedRequestBodyMarketplace {
  organizationId: string
  siteLocaleId: string
  requiredHasAggregator?: boolean
}

interface IBodyMarketplace {
  organizationIds: string[]
  siteLocaleIds: string[]
  isReviewProduct: boolean
}

interface IMarketplaceFormRequest {
  id?: string
  name: string
  currencyId: string
  marketplaceTypeId: string
  status: string
  version: number
}

interface IMarketplaceFormResponse {
  id?: string
  name: string
  currencyId: string
  status: string
  createdAt?: string
  modifiedAt?: string
  marketplaceType: {
    id: string
    name: string
  },
  currency: {
    id: string
    createdAt?: string
    modifiedAt?: string
    version: number
    name: string
  },
  version: number
}

export type {IMarketplace, IMarketplaceType, IUnAssignedRequestBodyMarketplace, IBodyMarketplace, 
  IMarketplaceFormRequest, IMarketplaceFormResponse}
