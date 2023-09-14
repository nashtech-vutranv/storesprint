import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {
  IPagination,
  IProductCategoryMappings,
  IProductCategoryMappingsFilter,
  IUpdateProductCategoryMapping,
  IProductCategoryShorten,
  IAddProductCategoriesMapping,
  IProductCategoryDetailResponseData,
  IProductCategoryDetailRequestData,
  ISplitPropertyValues,
} from '../interface'

class ProductCategoryMappingsService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getProductCategory(organizationId?: string) {
    let url = '/product-category'
    if (organizationId) {
      url = `${url}?organizationId=${organizationId}`
    }
    return this.axiosClient.get<IProductCategoryShorten[]>(url, {
      baseURL: process.env.REACT_APP_API_INVENTORY_SERVER_URL,
    })
  }

  filterProductCategoryMappings(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    filter: IProductCategoryMappingsFilter | {}
  ) {
    const productCategoryMappingsData = this.axiosClient.post(
      `/marketplace-mappings/product-category/filter?${generateFilterPaginationQuery(
        paginationQuery ?? undefined
      )}`,
      filter,
      {
        baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
      }
    )
    return productCategoryMappingsData
  }

  getProductCategoryMappingsById(id?: string) {
    return this.axiosClient.get(`/product-category_mappings/${id}`)
  }

  addProductCategoryMappings(entity: IProductCategoryMappings) {
    return this.axiosClient.post('/product-category_mappings', entity)
  }

  editProductCategoryMappings(entity: IProductCategoryMappings) {
    return this.axiosClient.put(
      `/product-category_mappings/${entity.id}`,
      entity
    )
  }

  addProductCategoryMapping(
    productCategoryMappingData: IUpdateProductCategoryMapping
  ) {
    const requestUrl = '/marketplace-mappings/product-category'
    return this.axiosClient.post(requestUrl, productCategoryMappingData, {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
    })
  }

  addProductCategoriesMapping(
    productCategoriesMappingData: IAddProductCategoriesMapping
  ) {
    const requestUrl = '/marketplace-mappings/product-category'
    return this.axiosClient.post(requestUrl, productCategoriesMappingData, {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
    })
  }

  editProductCategoryMapping(
    productCategoryMappingData: IUpdateProductCategoryMapping,
    productCategoryMappingsId: string
  ) {
    const requestUrl = `/marketplace-mappings/product-category/${productCategoryMappingsId}`
    return this.axiosClient.put(requestUrl, productCategoryMappingData, {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
    })
  }

  getSplitPropertyValues(mmsProductCategoryId: string | null) {
    const requestUrl = `/product-category/${mmsProductCategoryId}/properties`
    return this.axiosClient.get<ISplitPropertyValues>(requestUrl, {
      baseURL: process.env.REACT_APP_API_INVENTORY_SERVER_URL,
    })
  }

  getPropertyValues() {
    const requestUrl = '/properties/values'
    return this.axiosClient.get<ISplitPropertyValues>(requestUrl, {
      baseURL: process.env.REACT_APP_API_INVENTORY_SERVER_URL,
    })
  }

  getPropertyValuesByPropetyId(propertyId: string) {
    const requestUrl = `/properties/${propertyId}/values`
    return this.axiosClient.get(requestUrl, {
      baseURL: process.env.REACT_APP_API_INVENTORY_SERVER_URL,
    })
  }

  getProductCategoryMapping(productCategoryMappingId: string) {
    const requestUrl = `/marketplace-mappings/product-category/${productCategoryMappingId}`
    return this.axiosClient.get<IProductCategoryDetailResponseData>(
      requestUrl,
      {
        baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
      }
    )
  }

  editProductCategoriesMapping(
    productCategoriesMappingData: IProductCategoryDetailRequestData
  ) {
    const requestUrl = '/marketplace-mappings/product-category'
    return this.axiosClient.put(requestUrl, productCategoriesMappingData, {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
    })
  }
}

export default ProductCategoryMappingsService
