import _ from 'lodash'
import {
  IProductLocation,
  IRelationshipLocation,
  ICustomLocation,
} from '../interface/location'

export const getCurrentStatus = (
  _location:
    | IProductLocation
    | IRelationshipLocation
    | ICustomLocation,
  ignoreKeys?: string[]
) => {
  const {state} = _location
  if (!state) return null
  switch (state.currentStatus) {
    case 'apply':
    case null:
      return state.currentStatus
    case 'search':
      const entries = Object.entries(state)
      let searchOnFilter = false
      for (const [key, value] of entries) {
        if (
          ['currentStatus', 'eventKey'].includes(key) ||
          (ignoreKeys && ignoreKeys.includes(key))
        ) {
          continue
        }
        if (!_.isEmpty(value)) {
          searchOnFilter = true
          break
        }
      }
      return searchOnFilter ? 'apply' : null
    default:
      return null
  }
}

export const getSortOrder = (order: any) => {
  switch (order) {
    case 1:
      return 'asc'
    case -1:
      return 'desc'
    default:
      return 'asc'
  }
}
