import {IOrganization} from '../../interface/organization'
import {IOrganizationAction, OrganizationActionType} from '../actions'
import {storeOrganizationInfoToLocal} from '../../helpers/localstorage'

const organizationInitialState: IOrganization | null = null

const organizationReducer = (
  state: IOrganization | null,
  action: IOrganizationAction
) => {
  switch (action.type) {
    case OrganizationActionType.GET_ORGANIZATION_INFORMATION: {
      storeOrganizationInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {organizationInitialState, organizationReducer}
