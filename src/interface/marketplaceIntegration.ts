export interface IMagentoIntegration {
    localeMarketplaceId: string
    accessToken: string
    shopDomain: string
}

export interface IBigCommerceIntegration {
    localeMarketplaceId: string
    accessToken: string
    clientId: string
    clientSecret: string
    storeHash: string
}

export interface IWooCommerceIntegration {
    localeMarketplaceId: string
    consumerKey: string
    consumerSecret: string
    storeUrl: string
}