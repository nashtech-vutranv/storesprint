import {ISite} from '../../interface/organization'
import {ISiteAction, SiteActionType} from '../actions'
import {storeSiteInfoToLocal} from '../../helpers/localstorage'

const siteInitialState: ISite = {
  id: '',
  organizationId: '',
  erpId: '',
  createdAt: '',
  modifiedAt: '',
  name: '',
  url: '',
  version: 0
}

const siteReducer = (state: ISite, action: ISiteAction) => {
  switch (action.type) {
    case SiteActionType.GET_SITE_INFORMATION: {
      storeSiteInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {siteInitialState, siteReducer}
