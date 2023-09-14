import {
  MARKETPLACE_INTEGRATION_KEY,
  MARKETPLACE_INTEGRATION_STATE_KEY,
} from '../constants'
import {
  IIntegration,
  IntegrationMarketplaceType,
} from '../interface/integration'

const getMarketplaceType: (queryParamState: string | null) 
=> IntegrationMarketplaceType | null = (
  queryParamState
) => {
  if (queryParamState) {
    if (queryParamState.includes('shopify')) return 'shopify'
    if (queryParamState.includes('tiktok')) return 'tiktok'
  }

  return null
}

export const handleMarketplaceIntegrate = () => {
  const queryParam = new URLSearchParams(window.location.search)
  const queryParamState = queryParam.get('state')
  const localIntegrationState = localStorage.getItem(
    MARKETPLACE_INTEGRATION_STATE_KEY
  )
  if (
    !queryParamState ||
    !localIntegrationState ||
    queryParamState !== localIntegrationState
  )
    return
  const type = getMarketplaceType(queryParamState)
  if (type) {
    const integrationObj: IIntegration = {
      type,
      queryString: window.location.search,
    }
    localStorage.setItem(
      MARKETPLACE_INTEGRATION_KEY,
      JSON.stringify(integrationObj)
    )
    localStorage.removeItem(MARKETPLACE_INTEGRATION_STATE_KEY)
    window.close()
  }
}
