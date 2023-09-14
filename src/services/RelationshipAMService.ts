import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {IPagination} from '../interface/pagination'
import {IAddRelationshipAM} from '../interface/relationshipAM'

class RelationshipAMService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getRelationshipAMs(search: string, paginationQuery?: IPagination) {
    const relationshipAMsData = this.axiosClient.post(
      `/marketplace-types/filter?${generateFilterPaginationQuery(paginationQuery)}`, {
        search
      }
    )
    return relationshipAMsData
  }

  addRelationshipAM(relationshipAMData: IAddRelationshipAM) {
    return this.axiosClient.post('/marketplace-aggregators', relationshipAMData)
  }

}

export default RelationshipAMService
