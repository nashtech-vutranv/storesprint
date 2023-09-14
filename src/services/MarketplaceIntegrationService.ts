import {AxiosInstance} from 'axios'
import {
  IBigCommerceIntegration,
  IMagentoIntegration,
  IWooCommerceIntegration,
} from '../interface'

class MarketplaceIntegrationService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  integrateMagento(info: IMagentoIntegration) {
    const result = this.axiosClient.post(
      '/marketplaces/integration/magento',
      info
    )
    return result
  }

  integrateBigCommerce(info: IBigCommerceIntegration) {
    const result = this.axiosClient.post(
      '/marketplaces/integration/bigcommerce',
      info
    )
    return result
  }

  integrateWooCommerce(info: IWooCommerceIntegration) {
    const result = this.axiosClient.post(
      '/marketplaces/integration/woocommerce',
      info
    )
    return result
  }

  getMagentoIntegrationInformation(localeMarketplaceId: string) {
    const result = this.axiosClient.get(
      `/marketplaces/integration/magento/is-integrated/locale-marketplace/${localeMarketplaceId}`
    )
    return result
  }

  getBigCommerceIntegrationInformation(localeMarketplaceId: string) {
    const result = this.axiosClient.get(
      `/marketplaces/integration/bigcommerce/is-integrated/locale-marketplace/${localeMarketplaceId}`
    )
    return result
  }

  getWooCommerceIntegrationInformation(localeMarketplaceId: string) {
    const result = this.axiosClient.get(
      `/marketplaces/integration/woocommerce/is-integrated/locale-marketplace/${localeMarketplaceId}`
    )
    return result
  }
}

export default MarketplaceIntegrationService
