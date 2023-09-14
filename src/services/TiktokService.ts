import {AxiosInstance} from 'axios'
import {ITiktokIntegrate} from '../interface/tiktok'

class TiktokService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_TIKTOK_ADAPTER_SERVER_URL
    this.axiosClient = axiosClient
  }

  getAppKey() {
    return this.axiosClient.get('/integration/app-key')
  }

  integrate(integrateData: ITiktokIntegrate) {
    return this.axiosClient.post('/integration', integrateData)
  }

  getIntegrationInfo(localeMarketplaceId: string) {
    return this.axiosClient.get(
      `/integration/is-integrated/locale-marketplace/${localeMarketplaceId}`
    )
  }

}

export default TiktokService
