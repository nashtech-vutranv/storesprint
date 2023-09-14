type IntegrationMarketplaceType = 'tiktok' | 'shopify'
interface IIntegration {
  type: IntegrationMarketplaceType,
  queryString: string
}

export type {IIntegration, IntegrationMarketplaceType}