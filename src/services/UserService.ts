import {AxiosInstance} from 'axios'
import {IPagination} from '../interface/pagination'
import {IUsersFilter} from '../interface/filters'
import {
  generateFilterPaginationQuery,
} from '../helpers/queryParams'
import {IUser} from '../interface/user'
import {IUserSetting} from '../interface/userSetting'

class UserService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getUsersByFilter(
    filterPaginationQuery: Omit<IPagination, 'keyword'>,
    usersFilterObj: IUsersFilter
  ) {
    const requestUrl = `/users/filter?${generateFilterPaginationQuery(
      filterPaginationQuery
    )}`

    const usersData = this.axiosClient.post(requestUrl, usersFilterObj)
    return usersData
  }

  getUserById(userId: string | undefined) {
    const userData = this.axiosClient.get(`/users/${userId}`)
    return userData
  }

  addUser(userData: IUser) {
    return this.axiosClient.post('/users', userData)
  }

  editUser(userId: string, data: IUser) {
    return this.axiosClient.put(`/users/${userId}`, data)
  }

  getCurrentUserSetting() {
    return this.axiosClient.get('/users/current-user')
  }

  updateCurrentUserSetting(userSettingData: IUserSetting) {
    return this.axiosClient.put('/users/current-user/setting', userSettingData)
  }
}

export default UserService
