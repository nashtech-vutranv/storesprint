import {AxiosInstance} from 'axios'
import {IPagination} from '../interface/pagination'
import {ISitesFilter} from '../interface/filters'
import {
  generateFilterPaginationQuery,
  buildPaginationQueryOpts,
} from '../helpers/queryParams'

class SiteServices {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getSitesByOrganizationId(orgId: string) {
    const sitesData = this.axiosClient.get(`/organizations/${orgId}/sites`)
    return sitesData
  }

  getSitesByOrganization(orgId: string | undefined, paginationQuery: any) {
    const sitesData = this.axiosClient.get(
      `/organizations/${orgId}/sites?${buildPaginationQueryOpts(
        paginationQuery
      )}`
    )
    return sitesData
  }

  getSitesFromMultiOrganizations(
    sitesFilter: ISitesFilter,
    paginationQuery: Omit<IPagination, 'keyword'>
  ) {
    const sitesData = this.axiosClient.post(
      `/sites/filter?${generateFilterPaginationQuery(paginationQuery)}`,
      sitesFilter
    )
    return sitesData
  }

  getSiteById(siteId: string | undefined) {
    const siteData = this.axiosClient.get(`/sites/${siteId}`)
    return siteData
  }

  getSiteLocales(siteId: string, paginationQuery: any) {
    const siteLocalesData = this.axiosClient.get(
      `/sites/${siteId}/sitelocales?${buildPaginationQueryOpts(
        paginationQuery
      )}`
    )
    return siteLocalesData
  }

  createSite(siteData: any) {
    return this.axiosClient.post('/sites', siteData)
  }

  editSite(siteData: any) {
    return this.axiosClient.put(`/sites/${siteData.id}`, siteData)
  }
}

export default SiteServices
