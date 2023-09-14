import faker from '@faker-js/faker'
import {IMarketplaceRelationship} from '../../interface/marketplaceRelationship'
import {mockMarketplace} from './marketplaces'
import {mockOrganization, mockSite, mockSiteLocale} from './organization'
import {mockWarehouses} from './warehouse'

export const mockMarketplaceRelationship = (): IMarketplaceRelationship => {
  return {
    id: faker.random.word(),
    version: faker.datatype.number(),
    status: faker.datatype.string(),
    aggregatorId: faker.datatype.string(),
    marketplaceId: faker.datatype.string(),
    marketplace: mockMarketplace(),
    marketplaceType: {
      id: 'test',
      name: 'Tiktok',
    },
    organizationId: faker.datatype.string(),
    organization: mockOrganization(),
    siteLocaleId: faker.datatype.string(),
    siteLocale: mockSiteLocale(),
    site: mockSite(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    stockMinimumLevel: faker.datatype.number(),
    sellingPriceAdjustment: faker.datatype.number(),
    isProductsReviewedBeforeListing: true,
    organizationWarehouse: mockWarehouses().data.content,
  }
}

export const mockMarketplaceRelationships = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() =>
        mockMarketplaceRelationship()
      ),
      totalElements: 10,
    },
  }
}
