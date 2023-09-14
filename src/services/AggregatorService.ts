import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {IAggregator} from '../interface/aggregator'
import {IPagination} from '../interface/pagination'

class AggregatorService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  fetchAllAggregators(paginationQuery: Omit<IPagination, 'keyword'> | null, searchObj: {search: string}) {
    const aggregatorsData = this.axiosClient.post(
      `/aggregators/filter?${generateFilterPaginationQuery(paginationQuery ?? undefined)}`,
      searchObj
    )
    return aggregatorsData
  }

  fetchAggregatorById(id?: string) {
    return this.axiosClient.get(`/aggregators/${id}`)
  }

  addAggregator(entity: IAggregator) {
    return this.axiosClient.post('/aggregators', entity)
  }

  editAggregator(entity: IAggregator) {
    return this.axiosClient.put(
      `/aggregators/${entity.id}`,
      entity
    )
  }
}

export default AggregatorService
