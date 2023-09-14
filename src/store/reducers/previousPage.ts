import {IPreviousPageActionType, PreviousPageActionType} from '../actions'
import {
  storePreviousPageInfoToSession,
  getPreviousPageInfoFromSession,
} from '../../helpers'
import {IPreviousPage} from '../../interface'

const previousPageInitialState: IPreviousPage | null =
  getPreviousPageInfoFromSession(null)

const previousPageReducer = (
  state: IPreviousPage | null,
  action: IPreviousPageActionType<IPreviousPage | null>
) => {
  switch (action.type) {
    case PreviousPageActionType.GET_CURRENT_PREVIOUS_PAGE_INFORMATION: {
      storePreviousPageInfoToSession(action.payload)
      return action.payload
    }
    default:
      return state
  }
}

export {previousPageInitialState, previousPageReducer}
