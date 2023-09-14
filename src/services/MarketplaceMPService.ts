import {AxiosInstance} from 'axios'
import {
  generateFilterPaginationQuery,
} from '../helpers/queryParams'
import {IRequestBodyCalculateAssignMarketplaces} from '../interface/assignMarketplace'
import {IBodyRequestAssignProductsToMarketplaces, IBodyRequestAssignedProducts} from '../interface/assignedProduct'
import {IPagination} from '../interface/pagination'

class MarketplaceInventoryService {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  getCalculateAssigneMarketplaces(body: IRequestBodyCalculateAssignMarketplaces) {
    return this.axiosClient.post('/marketplaces/calculate-assign', body)
  }

  assignSelectedProductsToMarketplaces(body: IBodyRequestAssignProductsToMarketplaces) {
    return this.axiosClient.post('/marketplaces/assigned-products', body)
  }

  getProductsMarketplaceByFilter(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    productsFilterObj: IBodyRequestAssignedProducts | {}
  ) {
    const requestUrl = `/marketplaces/assigned-products/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const productsData = this.axiosClient.post(requestUrl, productsFilterObj)
    return productsData
  }
}

export default MarketplaceInventoryService
