import {AxiosInstance} from 'axios'
import {
  generateFilterPaginationQuery,
} from '../helpers/queryParams'
import {IPagination} from '../interface/pagination'
import {IProductPropertiesFilter} from '../interface/filters'
import {IProducProperties} from '../interface/productProperties'

class ProductPropertiesService {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_INVENTORY_SERVER_URL
    this.axiosClient = axiosClient
  }

  fetchProductPropertyTypes() {
    return this.axiosClient.get('/properties/types')
  }

  getProductProperties(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    productsFilterObj: IProductPropertiesFilter | {}
  ) {
    const requestUrl = `/properties/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const productsData = this.axiosClient.post(requestUrl, productsFilterObj)
    return productsData
  }

  fetchProductPropertiesById(id?: string) {
    return this.axiosClient.get(`/properties/${id}`)
  }

  addProductProperty(entity: IProducProperties) {
    return this.axiosClient.post('/properties', entity)
  }

  editProductProperty(entity: IProducProperties) {
    return this.axiosClient.put(
      `/properties/${entity.id}`,
      entity
    )
  }

  getGenericProperties() {
    const genericProperties = this.axiosClient.get('/properties/generic')
    return genericProperties
  }

  getLocaleProperties() {
    const genericProperties = this.axiosClient.get('/properties/locale')
    return genericProperties
  }

  exportProductProperties () {
    const result = this.axiosClient.get('/properties/export', {
      responseType: 'blob'
    })
    return result
  }
}

export default ProductPropertiesService
