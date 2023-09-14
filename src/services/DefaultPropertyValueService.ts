import {AxiosInstance} from 'axios'
import {generateFilterPaginationQuery} from '../helpers/queryParams'
import {ICreateUpdateDefaultPropertyValue} from '../interface/defaultPropertyValue'
import {IDefaultPropertyValueFilter} from '../interface/filters'
import {IPagination} from '../interface/pagination'

const queryString = require('query-string')

class DefaultPropertyValueService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_INVENTORY_SERVER_URL
    this.axiosClient = axiosClient
  }

  fetchAllDefaultPropertyValues(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    searchObj: IDefaultPropertyValueFilter
  ) {
    let query = queryString.stringify(searchObj)
    if (paginationQuery) {
      query = query + `&${generateFilterPaginationQuery(paginationQuery)}`
    }
    const result = this.axiosClient.post(
      `/default-property-value/filter?${query}`,
      searchObj
    )
    return result
  }

  fetchDefaultPropertyValueById(id?: string) {
    return this.axiosClient.get(`/default-property-value/${id}`)
  }

  addDefaultPropertyValue(entity: ICreateUpdateDefaultPropertyValue) {
    if (entity.localeId === '') {
      entity.localeId = undefined
    }
    return this.axiosClient.post('/default-property-value', entity)
  }

  editDefaultPropertyValue(id: string, defaultValue: string) {
    return this.axiosClient.put(`/default-property-value/${id}`, {
      defaultValue,
    })
  }

  filterProperties(
    paginationQuery: Omit<IPagination, 'keyword'> | null,
    searchObj: {search: string}
  ) {
    const result = this.axiosClient.post(
      `/properties/filter?${generateFilterPaginationQuery(
        paginationQuery ?? undefined
      )}`,
      searchObj
    )
    return result
  }
}

export default DefaultPropertyValueService
