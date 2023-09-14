import {NavigateActionType, INavigationAction} from '../actions'
import {
  storeNavigateInfoToLocal,
  getNavigateInfoFromLocal,
} from '../../helpers/localstorage'
import {seoProperty} from '../../constants/seo-url'

const navigateInitialState: string = getNavigateInfoFromLocal(seoProperty.daskboard)

const navigateReducer = (state: string, action: INavigationAction<string>) => {
  switch (action.type) {
    case NavigateActionType.GET_CURRENT_PAGE_SEO_NAME: {
      storeNavigateInfoToLocal(action.payload)
      return action.payload
    }

    default:
      return state
  }
}

export {navigateInitialState, navigateReducer}
