import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {GlobalContext} from '../store/GlobalContext'
import {ROUTE_PARAMS, ROUTE_ORDER, ROUTE_LISTING_STATUS} from '../constants'

export default function useGoBack(persistState: any, listPageOriginUrl: string) {
  const navigate = useNavigate()
  const {
    state: {previousPage}
  } = useContext(GlobalContext)

  const goBackToViewListPage = () => {
    if (persistState && persistState.viewlistLocation && 
      persistState.viewlistLocation.pathname && persistState.viewlistLocation.search) {
      const prevUrl = `${persistState.viewlistLocation.pathname}${persistState.viewlistLocation.search}`
      prevUrl &&
        navigate(prevUrl, {
          state: persistState,
        })
    }
     else navigate(listPageOriginUrl)
  }

  const goBackToPreviousPage = () => {
    if (previousPage) {
      switch (previousPage.name) {
        case 'apps-order-detail':
          navigate(
            ROUTE_ORDER.DETAIL.replace(
              ROUTE_PARAMS.ORDER_ID,
              previousPage.data.orderId
            )
          )
          break
        case 'apps-listing-status':
          navigate(
            ROUTE_LISTING_STATUS.ROOT
          )
          break
        default:
          return
      }
    }
  }

  return {
    goBackToViewListPage,
    goBackToPreviousPage,
  }
}