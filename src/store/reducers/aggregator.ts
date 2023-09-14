import {IAggregator} from '../../interface/aggregator'
import {AggregatorActionType, IAggregatorAction} from '../actions'
import {storeAggregatorInfoToLocal} from '../../helpers/localstorage'

const aggregatorInitialState: IAggregator | null = null

const aggregatorReducer = (
  state: IAggregator | null,
  action: IAggregatorAction
) => {
  switch (action.type) {
    case AggregatorActionType.GET_AGGREGATOR_INFORMATION: {
        storeAggregatorInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {aggregatorInitialState, aggregatorReducer}
