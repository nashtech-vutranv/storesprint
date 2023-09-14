import {IMarketplace} from '../../interface/marketplace'
import {MarketplaceActionType, IMarketplaceAction} from '../actions'
import {storeMarketplaceInfoToLocal} from '../../helpers/localstorage'

const marketplaceInitialState: IMarketplace | null = null

const marketplaceReducer = (
  state: IMarketplace | null,
  action: IMarketplaceAction
) => {
  switch (action.type) {
    case MarketplaceActionType.GET_MARKETPLACE_INFORMATION: {
        storeMarketplaceInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {marketplaceInitialState, marketplaceReducer}
