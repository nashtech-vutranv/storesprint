interface IShopifyIntegrate {
  localeMarketplaceId: string
  authCode: string
  shopDomain: string
}

interface IShopifyIntegrateWithCustomApp extends Omit<IShopifyIntegrate, 'authCode'> {
  accessToken: string 
}

export type {IShopifyIntegrate, IShopifyIntegrateWithCustomApp}
