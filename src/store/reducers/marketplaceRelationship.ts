import {IMarketplaceRelationship,} from '../../interface/marketplaceRelationship'
import {MarketplacerRelationshipActionType, IMarketplaceRelationshipAction} from '../actions'
import {storeMarketplaceRelationInfoToLocal} from '../../helpers/localstorage'

const marketplaceRelationshipInitialState: IMarketplaceRelationship | null = null

const marketplaceRelationshipReducer = (
  state: IMarketplaceRelationship | null,
  action: IMarketplaceRelationshipAction
) => {
  switch (action.type) {
    case MarketplacerRelationshipActionType.GET_MARKETPLACE_RELATIONSHIPT_INFORMATION: {
      storeMarketplaceRelationInfoToLocal(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}

export {marketplaceRelationshipInitialState, marketplaceRelationshipReducer}
