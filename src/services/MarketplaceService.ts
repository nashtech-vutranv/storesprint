import {AxiosInstance} from 'axios'
import {
  generateFilterPaginationQuery,
  buildPaginationQueryOpts,
} from '../helpers/queryParams'
import {
  IUnAssignedRequestBodyMarketplace,
  IBodyMarketplace,
  IMarketplaceFormRequest,
} from '../interface/marketplace'
import {IPagination} from '../interface/pagination'

class MarketplaceService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  fetchAllMarketplaces(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    searchObj: {search: string; requiredHasAggregator?: boolean}
  ) {
    const marketplacesData = this.axiosClient.post(
      `/marketplaces/filter?${generateFilterPaginationQuery(
        paginationQuery ?? undefined
      )}`,
      {
        search: searchObj.search,
        requiredHasAggregator: Boolean(searchObj.requiredHasAggregator),
      }
    )
    return marketplacesData
  }

  fetchMarketplaceById(id?: string) {
    return this.axiosClient.get(`/marketplaces/${id}`)
  }

  getUnAssignedMarketplaces(entity: IUnAssignedRequestBodyMarketplace) {
    entity.requiredHasAggregator = Boolean(entity.requiredHasAggregator)
    return this.axiosClient.post('/marketplaces/unassigned/filter', entity)
  }

  addMarketplace(entity: IMarketplaceFormRequest) {
    return this.axiosClient.post('/marketplaces', entity)
  }

  editMarketplace(entity: IMarketplaceFormRequest) {
    return this.axiosClient.put(`/marketplaces/${entity.id}`, entity)
  }

  getMarketplacesWithIsProductReviewProp(
    paginationQueryParam: any,
    entity: IBodyMarketplace
  ) {
    return this.axiosClient.post(
      `/marketplaces/filter?${buildPaginationQueryOpts(paginationQueryParam)}`,
      entity
    )
  }

  getMarketplaceTypeInformation() {
    return this.axiosClient.get('/marketplace-types', {
      baseURL: process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    })
  }
}

export default MarketplaceService
