import {AxiosInstance, AxiosResponse} from 'axios'
import {
  generateFilterPaginationQuery,
  buildPaginationQueryOpts,
} from '../helpers/queryParams'
import {IPagination} from '../interface/pagination'
import {IProductsFilter} from '../interface/filters'
import {IBodyRequestAssignedProducts} from '../interface/assignedProduct'
import {IProductDetail, IUpdatePropertyDetailRequest} from '../interface/products'

class ProductServices {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_INVENTORY_SERVER_URL
    this.axiosClient = axiosClient
  }

  getProductsByOrganizationId(orgId: string, paginationQuery: IPagination) {
    const requestUrl = `/products?orgId=${orgId}&${buildPaginationQueryOpts(
      paginationQuery
    )}`
    const producstData = this.axiosClient.get(requestUrl)
    return producstData
  }

  getProductsByFilter(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    productsFilterObj: IProductsFilter | {}
  ) {
    const requestUrl = `/products/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const productsData = this.axiosClient.post(requestUrl, productsFilterObj)
    return productsData
  }

  getProductsMarketplaceByFilter(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    productsFilterObj: IBodyRequestAssignedProducts | {}
  ) {
    const requestUrl = `/products/assigned-marketplaces/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const productsData = this.axiosClient.post(requestUrl, productsFilterObj)
    return productsData
  }

  getProductById(productId: string): Promise<AxiosResponse<IProductDetail>> {
    const requestUrl = `/products/${productId}`
    return this.axiosClient.get(requestUrl)
  }

  updateProductDetail(
    editedProductDetail: IUpdatePropertyDetailRequest,
    productId: string
  ) {
    // Reserve API update generic properties
    const requestUrl = `/products/${productId}`
    return this.axiosClient.put(requestUrl, editedProductDetail)
  }

  getTotalStockLevelByProductId(productId: string) {
    const requestUrl = `/warehouse-product/product/${productId}/total-stock-level`
    return this.axiosClient.get(requestUrl)
  }

  getWarehouseProductStockByProductId(
    productId: string,
    paginationQuery: Omit<IPagination, 'keyword'>
  ) {
    const requestUrl = `/warehouse-product/product/${productId}?${generateFilterPaginationQuery(
      paginationQuery
    )}`
    return this.axiosClient.get(requestUrl)
  }

  getPricesByProductId(
    productId: string,
    paginationQuery: Omit<IPagination, 'keyword'>
  ) {
    const requestUrl = `/locale-product/product/${productId}?${generateFilterPaginationQuery(
      paginationQuery
    )}`
    return this.axiosClient.get(requestUrl)
  }

  getMarketplacesByProductId(
    productId: string,
    paginationQuery: Omit<IPagination, 'keyword'>
  ) {
    const requestUrl = `/marketplace-product/product/${productId}?${generateFilterPaginationQuery(
      paginationQuery
    )}`
    return this.axiosClient.get(requestUrl, {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL,
    })
  }
}

export default ProductServices
