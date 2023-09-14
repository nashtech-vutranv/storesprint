import {AxiosInstance} from 'axios'
import {IFormResource} from '../interface/resource'
import {IPagination} from '../interface/pagination'
import {
  buildPaginationQueryOpts,
} from '../helpers/queryParams'

class ResourceService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getResoucesByUserId(userId: string, paginationQuery: IPagination) {
    const resourcesData = this.axiosClient.get(
      `/users/${userId}/resources?${buildPaginationQueryOpts(paginationQuery)}`
    )
    return resourcesData
  }

  getResourceById(resourceId: string, mockData?: any) {
    if (mockData) {
      return mockData
    }
    return this.axiosClient.get(`/resources/${resourceId}`)
  }

  getOrganizationsByExcludedAllSiteOption(userId: string, mockData?: any) {
    if (mockData) {
      return mockData
    }
    return this.axiosClient.get(`/users/${userId}/organizations-unassigned`)
  }

  getSitesBySelectedExcludedAllSiteOrganization(
    userId: string,
    organizationId: string,
    mockData?: any
  ) {
    if (mockData) {
      return mockData
    }
    return this.axiosClient.post(
      '/sites/unassigned/filler',
      {
        organizationId,
        userId
      }
    )
  }

  addResource(addResourceData: IFormResource) {
    return this.axiosClient.post('/resources', {...addResourceData, version: 0})
  }

  editResource(resourceId: string, updateResourceData: IFormResource & {version: number}) {
    return this.axiosClient.put(`/resources/${resourceId}`, updateResourceData)
  }
}

export default ResourceService
