import {AxiosInstance} from 'axios'
import {IImportProductPropertiesResult} from '../interface'

class ImportProductPropertiesService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL =
      process.env.REACT_APP_API_INVENTORY_SERVER_URL
    this.axiosClient = axiosClient
  }

  importProductProperties(file: File, isAllowOverride?: boolean) {
    const formData = new FormData()
    formData.append('propertiesFile ', file)
    let query = '/properties/import'
    if (isAllowOverride !== undefined) {
      query = `${query}?isAllowOverride=${isAllowOverride}`
    }
    const result = this.axiosClient.post<IImportProductPropertiesResult>(query, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    return result
  }
}

export default ImportProductPropertiesService
