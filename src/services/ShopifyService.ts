import {AxiosInstance} from 'axios'
import {
  IShopifyIntegrate,
  IShopifyIntegrateWithCustomApp,
} from '../interface/shopify'

class ShopifyService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_SHOPIFY_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getAppKey() {
    return this.axiosClient.get('/integration/app-key')
  }

  integrateWithPublicApp(integrateData: IShopifyIntegrate) {
    return this.axiosClient.post('/integration', integrateData)
  }

  getIntegrationInfo(localeMarketplaceId: string) {
    return this.axiosClient.get(
      `/integration/is-integrated/locale-marketplace/${localeMarketplaceId}`
    )
  }

  integrateWithCustomApp(
    integrateAccessTokenData: IShopifyIntegrateWithCustomApp
  ) {
    return this.axiosClient.post('/integration', integrateAccessTokenData)
  }
}

export default ShopifyService
