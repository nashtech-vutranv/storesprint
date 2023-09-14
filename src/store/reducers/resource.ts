import {IResource} from '../../interface/resource'
import {IResourceAction, ResourceActionType} from '../actions'
import {storeResourceInfoToLocal} from '../../helpers/localstorage'

const resourceInitialState: IResource = {
  id: '',
  erpId: '',
  createdAt: '',
  modifiedAt: '',
  version: 0,
  organizationResponse: {
    id: '',
    erpId: '',
    createdAt: '',
    modifiedAt: '',
    name: '',
    version: 0,
    additionalInformation: '',
    contactName: '',
    contactPhoneNumber: '',
    contactEmailAddress: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    postCode: '',
    registrationNumber: '',
    vatRegistrationNumber: '',
  },
  siteResponse: {
    id: '',
    organizationId: '',
    erpId: '',
    createdAt: '',
    modifiedAt: '',
    name: '',
    url: '',
    version: 0,
  },
}

const resourceReducer = (state: IResource, action: IResourceAction) => {
  switch (action.type) {
    case ResourceActionType.GET_RESOURCE_INFORMATION: {
      storeResourceInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {resourceInitialState, resourceReducer}
