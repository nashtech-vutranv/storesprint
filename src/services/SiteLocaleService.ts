import {AxiosInstance} from 'axios'
import {IPagination} from '../interface/pagination'
import {ISiteLocalesFilter} from '../interface/filters'
import {generateFilterPaginationQuery} from '../helpers/queryParams'

class SiteLocaleService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getLocaleBySiteId(siteId: string | undefined) {
    return this.axiosClient.get(`/sitelocales/${siteId}`)
  }

  getLocalesList() {
    return this.axiosClient.get('locales')
  }

  getUnassignedLocales(siteId: string, includeLocale?: string) {
    let endpoint = `/sites/${siteId}/unassigned-locale`
    if (includeLocale) {
      endpoint = `${endpoint}?includeLocale=${encodeURIComponent(includeLocale)}`
    }
    return this.axiosClient.get(endpoint)
  }

  addLocale(siteData: any) {
    return this.axiosClient.post('/sitelocales', siteData)
  }

  editLocale(siteData: any) {
    return this.axiosClient.put(`/sitelocales/${siteData.id}`, siteData)
  }

  getLocalesFromMultiSites(
    siteLocalesFilter: ISiteLocalesFilter,
    paginationQuery: Omit<IPagination, 'keyword'>
  ) {
    const localesData = this.axiosClient.post(
      `/sitelocales/filter?${generateFilterPaginationQuery(paginationQuery)}`,
      siteLocalesFilter
    )
    return localesData
  }
}

export default SiteLocaleService
