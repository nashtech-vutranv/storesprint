import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {
  ICreateUpdateDeliveryTypeMapping,
  IDeliveryTypeMappingsFilter,
  IPagination,
} from '../interface'

class DeliveryService {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  filterDeliveryTypeMappings(
    pagination: Omit<IPagination, 'keyword'>,
    filterCriteria: IDeliveryTypeMappingsFilter | {}
  ) {
    const result = this.axiosClient.post(
      `/marketplace-mappings/delivery-type/filter?${generateFilterPaginationQuery(
        pagination
      )}`,
      filterCriteria
    )
    return result
  }

  createDeliveryTypeMapping(body: ICreateUpdateDeliveryTypeMapping) {
    const result = this.axiosClient.post(
      '/marketplace-mappings/delivery-type',
      body
    )
    return result
  }

  updateDeliveryTypeMapping(
    body: ICreateUpdateDeliveryTypeMapping,
    deliveryTypeMappingId: string
  ) {
    const result = this.axiosClient.put(
      `/marketplace-mappings/delivery-type/${deliveryTypeMappingId}`,
      body
    )
    return result
  }

  getDeliveryTypes() {
    return this.axiosClient.get('/delivery-type')
  }

  getMarketplaceDeliveryService(marketplaceTypeId: string) {
    return this.axiosClient.get(`/mapping-targets/delivery-types/marketplaceType/${marketplaceTypeId}`)
  }
}

export default DeliveryService
