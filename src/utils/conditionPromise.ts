import {mockOrganizations, mockSites, mockSiteLocales} from './factory/organization'
import {mockMarketplaces, mockCalculateAssignMarketplaces} from './factory/marketplaces'
import {mockAssignedProducts, mockAssignedProductsResponse} from './factory/product'
import {mockWarehouses} from './factory/warehouse'
import {mockMarketplaceRelationship} from './factory/marketplaceRelationships'

type IMockType = 'organization' | 'site' | 'siteLocale' |
 'marketplace' | 'calculateMarketplace' | 'warehouse' 
 | 'marketplaceRelationship' | 'assignedProduct' | 'assignedProductResponse'

export const conditionPromise = (objectFilter: unknown, typeMock: IMockType, objectPaginationQuery?: any) => {
  if (objectFilter || (objectFilter && objectPaginationQuery)) {
    switch (typeMock) {
      case 'organization': return Promise.resolve(mockOrganizations())
      case 'site': return Promise.resolve(mockSites())
      case 'siteLocale': return Promise.resolve(mockSiteLocales())
      case 'marketplace': return Promise.resolve(mockMarketplaces())
      case 'calculateMarketplace': return Promise.resolve(mockCalculateAssignMarketplaces())
      case 'warehouse': return mockWarehouses()
      case 'marketplaceRelationship': return mockMarketplaceRelationship()
      case 'assignedProduct': return Promise.resolve(mockAssignedProducts())
      case 'assignedProductResponse': return Promise.resolve(mockAssignedProductsResponse())

      default: return {}
    }
  } else return Promise.reject()
}