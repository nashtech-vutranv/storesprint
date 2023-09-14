import {IRowTableActionType, RowTableActionType} from '../actions'
import {storeRowTableToLocal, getRowTableFromLocal} from '../../helpers/localstorage'

const rowTableInitialState: number = getRowTableFromLocal(10)

const rowTableReducer = (state: number, action: IRowTableActionType<number>) => {
  switch (action.type) {
    case RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES: {
      storeRowTableToLocal(action.payload)
      return action.payload
    }
    default:
      return state
  }
}

export {rowTableInitialState, rowTableReducer}
