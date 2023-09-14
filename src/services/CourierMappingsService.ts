import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {ICourierMappingsFilter, IPagination} from '../interface'

class CourierMappingsService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  filterCourierMappings(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    filter: ICourierMappingsFilter | {}
  ) {
    const couriersResult = this.axiosClient.post(
      `/marketplace-mappings/couriers/filter?${generateFilterPaginationQuery(
        paginationQuery ?? undefined
      )}`,
      filter
    )
    return couriersResult
  }
}

export default CourierMappingsService
