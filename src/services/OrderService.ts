import {AxiosInstance} from 'axios'
import {
  buildPaginationQueryOpts,
  generateFilterPaginationQuery,
} from '../helpers/queryParams'
import {IOrdersFilter, IOrderReprocess, IPagination, IRequestReturnsRefunds} from '../interface'

class OrderServices {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_ORDER_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getOrderById(orderId: string) {
    const requestUrl = `/orders/${orderId}`
    const orderDetail = this.axiosClient.get(requestUrl)
    return orderDetail
  }

  getOrderlines(orderId: string) {
    const requestUrl = `/orders/${orderId}/orderLines`
    const orderlines = this.axiosClient.get(requestUrl)
    return orderlines
  }

  getShipments(orderId: string, paginationQuery?: IPagination) {
    const requestUrl = `/orders/${orderId}/shipments?${buildPaginationQueryOpts(
      paginationQuery
    )}`
    const shipments = this.axiosClient.get(requestUrl)
    return shipments
  }

  getStatuses() {
    return this.axiosClient.get('/orders/statuses')
  }

  getOrders(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    ordersFilterObj: IOrdersFilter | {}
  ) {
    const sortOrder = filterPaginationQuery.sortOrder === 1 ? 'asc' : 'desc'
    const sortById = `&sort=id,${sortOrder}`
    const requestUrl = `/orders/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}${sortById}`
    const orders = this.axiosClient.post(requestUrl, ordersFilterObj)
    return orders
  }

  reProcess(body: IOrderReprocess) {
    const result = this.axiosClient.post('/orders/reprocess', body)
    return result
  }

  countFailureOrder(ordersFilterObj: IOrdersFilter | {}) {
    const result = this.axiosClient.post(
      '/orders/filter/count-failure-orders',
      ordersFilterObj
    )
    return result
  }

  getOrderReturnStatuses() {
    return this.axiosClient.get('/order-returns/return-statuses')
  }

  getReturnsRefunds(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    requestData: IRequestReturnsRefunds | {},
  ) {
    const requestUrl = `/order-returns/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`
    return this.axiosClient.post(requestUrl, requestData)
  }
}

export default OrderServices
