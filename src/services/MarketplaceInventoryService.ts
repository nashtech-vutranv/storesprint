import {AxiosInstance} from 'axios'
import {IRequestBodyCalculateAssignMarketplaces} from '../interface/assignMarketplace'
import {IBodyRequestAssignProductsToMarketplaces} from '../interface/assignedProduct'

class MarketplaceInventoryService {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_INVENTORY_SERVER_URL
    this.axiosClient = axiosClient
  }

  getCalculateAssigneMarketplaces(body: IRequestBodyCalculateAssignMarketplaces) {
    return this.axiosClient.post('/marketplaces/calculate-assign', body)
  }

  assignSelectedProductsToMarketplaces(body: IBodyRequestAssignProductsToMarketplaces) {
    return this.axiosClient.post('/marketplaces/assigned-products', body)
  }
}

export default MarketplaceInventoryService
