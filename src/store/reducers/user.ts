import {IUser} from '../../interface/user'
import {IUserAction, UserActionType} from '../actions'
import {storeUserInfoToLocal} from '../../helpers/localstorage'

const userInitialState: IUser = {
  id: '',
  erpId: '',
  createdAt: '',
  modifiedAt: '',
  name: '',
  version: 0,
  firstName: '',
  lastName: '',
  emailAddress: '',
  status: ''
}

const userReducer = (state: IUser, action: IUserAction) => {
  switch (action.type) {
    case UserActionType.GET_USER_INFORMATION: {
      storeUserInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {userInitialState, userReducer}
