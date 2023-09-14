import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {
  IFormRequestMarketplaceRelationship,
  IQueryMarketplaceRelationship
} from '../interface/marketplaceRelationship'
import {IPagination} from '../interface/pagination'

class MarketplaceRelationshipService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getRelationshipsByFilter(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    query: IQueryMarketplaceRelationship | {}
  ) {
    const relationshipsData = this.axiosClient.post(
      `/organization-marketplaces/filter?${generateFilterPaginationQuery(
        paginationQuery ?? undefined
      )}`,
      query
    )
    return relationshipsData
  }

  getRelationshipById(relationshipId: string) {
    return this.axiosClient.get(`/organization-marketplaces/${relationshipId}`)
  }

  addMarketplaceRelationship(entity: IFormRequestMarketplaceRelationship) {
    return this.axiosClient.post('/organization-marketplaces', entity)
  }

  editMarketplaceRelationship(marketplaceRelationshipId: string, entity: IFormRequestMarketplaceRelationship) {
    return this.axiosClient.put(
      `/organization-marketplaces/${marketplaceRelationshipId}`,
      entity
    )
  }
}

export default MarketplaceRelationshipService
