import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {IListingStateFilter} from '../interface/filters'
import {IPagination} from '../interface/pagination'

class ListingStateService {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  getStatuses() {
    return this.axiosClient.get('/listings-state/statuses')
  }

  getListingState(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    listingStateFilterObj: IListingStateFilter | {}
  ) {
    return this.axiosClient.post(
      `/listings-state/filter?${generateFilterPaginationQuery(
        filterPaginationQuery
      )}`,
      listingStateFilterObj
    )
  }

  reList(request: {marketplaceProductIds: string[]}) {
    return this.axiosClient.post('/listings-state/re-list', request)
  }
}

export default ListingStateService
