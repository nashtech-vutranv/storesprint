import {AxiosInstance} from 'axios'
import {
  IMarketplaceProductCategory,
  IMarketplaceMapping,
  IValueMappingsRequest,
  IValueMappingsResponse,
  IUpdateValueMappingRequest,
} from '../interface'

class MappingsServices {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  getAllMappingMarketplaces() {
    const mappingMarketplaceData = this.axiosClient.get('/marketplace-types')
    return mappingMarketplaceData
  }

  getMappingTargetInProductCategory(marketplaceTypeId: string) {
    const requestUrl = `/mapping-targets/product-category/marketplace-type/${marketplaceTypeId}`
    const result =
      this.axiosClient.get<IMarketplaceProductCategory[]>(requestUrl)
    return result
  }

  getMarketplaceMapping(productCategoryMappingsId: string) {
    const requestUrl = `/marketplace-mappings/${productCategoryMappingsId}`
    const result = this.axiosClient.get<IMarketplaceMapping>(requestUrl)
    return result
  }

  getMappingProductEnumValues(
    requestData: IValueMappingsRequest,
  ) {
    const requestUrl = '/marketplace-mappings/product-enums/filter'
    return this.axiosClient.post<IValueMappingsResponse>(
      requestUrl,
      requestData
    )
  }

  getMMSProductPropertyValues(propertyId: string) {
    const requestUrl = `/properties/${propertyId}/enum-values`
    return this.axiosClient.get<string[]>(requestUrl, {
      baseURL: process.env.REACT_APP_API_INVENTORY_SERVER_URL,
    })
  }

  updateEnumValueMapping(requestData: IUpdateValueMappingRequest) {
    const requestUrl = '/marketplace-mappings/product-enums'
    return this.axiosClient.put(requestUrl, requestData)
  }
}

export default MappingsServices