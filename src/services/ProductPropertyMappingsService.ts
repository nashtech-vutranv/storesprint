import {AxiosInstance} from 'axios'
import {IProductPropertyMappingsFilter, IUpdateProductPropertyMapping} from '../interface'

class ProductPropertyMappingsService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  filterProductPropertyMappings(filter: IProductPropertyMappingsFilter | {}) {
    const productPropertyMappingsData = this.axiosClient.post(
      '/marketplace-mappings/product-attribute/filter',
      filter
    )
    return productPropertyMappingsData
  }

  getMarketplaceProductCategories(marketplaceTypeId: string) {
    const result = this.axiosClient.get(
      `/mapping-targets/product-category/marketplace-type/${marketplaceTypeId}`
    )
    return result
  }

  addProductPropertyMapping(requestData: IUpdateProductPropertyMapping) {
    const requestUrl = '/marketplace-mappings/product-attribute'
    return this.axiosClient.post(requestUrl, requestData)
  }

  getProductPropertyAttribute(mappingId: string) {
    const requestUrl = `/marketplace-mappings/product-attribute/${mappingId}`
    return this.axiosClient.get(requestUrl)
  }

  editProductPropertyMapping(mappingId: string, requestData: IUpdateProductPropertyMapping) {
    const requestUrl = `/marketplace-mappings/product-attribute/${mappingId}`
    return this.axiosClient.put(requestUrl, requestData)
  }
}

export default ProductPropertyMappingsService
