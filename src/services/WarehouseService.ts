import {AxiosInstance} from 'axios'
import {IPagination} from '../interface/pagination'
import {IWarehousesFilter} from '../interface/filters'
import {
  generateFilterPaginationQuery,
} from '../helpers/queryParams'

class WarehouseServices {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getWarehouseByFilter(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    warehouseFilterObj: IWarehousesFilter | {}
  ) {
    const requestUrl = `/warehouses/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const warehouseData = this.axiosClient.post(requestUrl, warehouseFilterObj)
    return warehouseData
  }
  
  getWarehouseById(warehouseId: string | undefined) {
    const warehouseData = this.axiosClient.get(`/warehouses/${warehouseId}`)
    return warehouseData
  }

  editWarehouse(data: any) {
    return this.axiosClient.put(`/warehouses/${data.id}`, data)
  }
}

export default WarehouseServices
