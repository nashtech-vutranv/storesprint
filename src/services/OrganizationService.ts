import {AxiosInstance} from 'axios'
import {IOrganization} from '../interface/organization'
import {IPagination} from '../interface/pagination'
import {
  generateFilterPaginationQuery,
  buildPaginationQueryOpts,
} from '../helpers/queryParams'

class OrganizationServices {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getAllOrganizations(paginationQuery: Omit<IPagination, 'keyword'>) {
    const organizationsData = this.axiosClient.get(
      `/organizations?${generateFilterPaginationQuery(paginationQuery)}`
    )
    return organizationsData
  }

  getAllOrganizationsByKeyword(paginationQuery: any) {
    const organizationsData = this.axiosClient.get(
      `/organizations?${buildPaginationQueryOpts(paginationQuery)}`
    )
    return organizationsData
  }

  getOrganizationById(id: string | undefined) {
    const requestUrl = `/organizations/${id}`
    const organizationsData = this.axiosClient.get(requestUrl)
    return organizationsData
  }

  addOrganization(entity: IOrganization) {
    const organizationsData = this.axiosClient.post('/organizations', entity)
    return organizationsData
  }

  editOrganization(entity: IOrganization) {
    const organizationsData = this.axiosClient.put(
      `/organizations/${entity.id}`,
      entity
    )
    return organizationsData
  }

  getOrganizationAndPlatformSetting(id: string) {
    const requestUrl = `/organizations/${id}/settings`
    const organizationsData = this.axiosClient.get(requestUrl)
    return organizationsData
  }
}

export default OrganizationServices
