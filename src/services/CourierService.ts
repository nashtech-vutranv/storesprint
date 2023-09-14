import {AxiosInstance} from 'axios'
import {ICreateUpdateCourierMapping} from '../interface/courierMapping'

class MappingsServices {
  public axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_MARKETPLACE_SERVER_URL
    this.axiosClient = axiosClient
  }

  getAllCouriers() {
    const mappingTypeData = this.axiosClient.get('/courier')
    return mappingTypeData
  }
  
  getMarketplaceCourier(id?: string) {
    return this.axiosClient.get(
      `/mapping-targets/couriers/marketplaceType/${id}`
    )
  }

  addCourierMapping(data: ICreateUpdateCourierMapping) {
    const requestUrl = '/marketplace-mappings/couriers'
    const mappingsData = this.axiosClient.post(requestUrl, data)
    return mappingsData
  }

  updateCourierMapping(data: ICreateUpdateCourierMapping, id?: string) {
    const requestUrl = `/marketplace-mappings/couriers/${id}`
    const result = this.axiosClient.put(requestUrl, data)
    return result
  }
}

export default MappingsServices
