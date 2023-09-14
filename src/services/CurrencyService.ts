import {AxiosInstance} from 'axios'

class CurrencyService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  fetchAllCurrencies() {
    const aggregatorsData = this.axiosClient.get('/currencies')
    return aggregatorsData
  }
}

export default CurrencyService
