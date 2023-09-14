import {KeycloakInstance} from 'keycloak-js'
import {IOrganization, ISite, IUser, IResource, IAggregator, IMarketplace, IMarketplaceRelationship, IAccordion, IPageStoreInformation, IIntegration} from '../interface'
import {LayoutColor, SideBarTheme, SideBarWidth, MARKETPLACE_INTEGRATION_KEY} from '../constants'

export const storeKeyCloakToLocal = (keyCloakInstance: KeycloakInstance) => {
  localStorage.setItem('keyCloak', JSON.stringify(keyCloakInstance))
}

export const removeKeyCloakFromLocal = () => {
  localStorage.removeItem('keyCloak')
}

export const getKeyCloakValueFromLocal = () => {
  return JSON.parse(localStorage.getItem('keyCloak') as any)
}

export const storeOrganizationInfoToLocal = (
  organizationInfo: IOrganization
) => {
  localStorage.setItem('organizationInfo', JSON.stringify(organizationInfo))
}

export const storeSiteInfoToLocal = (siteInfo: ISite) => {
  localStorage.setItem('siteInfo', JSON.stringify(siteInfo))
}

export const storeUserInfoToLocal = (userInfo: IUser) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export const storeResourceInfoToLocal = (resourceInfo: IResource) => {
  localStorage.setItem('resourceInfo', JSON.stringify(resourceInfo))
}

export const storeRowTableToLocal = (rowTable: number) => {
  localStorage.setItem('rowTable', JSON.stringify(rowTable))
}

export const storeAccordionInfoToLocal = (accordion: IAccordion) => {
  localStorage.setItem('accordionInfo', JSON.stringify(accordion))
}

export const storeLayoutColorToLocal = (layoutColor: LayoutColor) => {
  localStorage.setItem('layoutColor', JSON.stringify(layoutColor))
}

export const storeLeftSideBarThemeToLocal = (
  leftSideBarTheme: SideBarTheme
) => {
  localStorage.setItem('leftSideBarTheme', JSON.stringify(leftSideBarTheme))
}

export const storeLeftSideBarTypeToLocal = (leftSideBarType: SideBarWidth) => {
  localStorage.setItem('leftSideBarType', JSON.stringify(leftSideBarType))
}

export const storeAggregatorInfoToLocal = (aggregatorInfo: IAggregator) => {
  localStorage.setItem('aggregatorInfo', JSON.stringify(aggregatorInfo))
}

export const storeMarketplaceInfoToLocal = (marketplaceInfo: IMarketplace) => {
  localStorage.setItem('marketplaceInfo', JSON.stringify(marketplaceInfo))
}

export const storeMarketplaceRelationInfoToLocal = (
  marketplaceRelationInfo: IMarketplaceRelationship
) => {
  localStorage.setItem(
    'marketplaceRelationshipInfo',
    JSON.stringify(marketplaceRelationInfo)
  )
}

export const storePagesInfoToLocal = (pagesInfo: IPageStoreInformation) => {
  localStorage.setItem('pagesInfo', JSON.stringify(pagesInfo))
}

export const storeIntegrationInfoToLocal = (
  integrationInfo: IIntegration | null
) => {
  localStorage.setItem(
    MARKETPLACE_INTEGRATION_KEY,
    JSON.stringify(integrationInfo)
  )
}

export const storeNavigateInfoToLocal = (currentPageSeoName: string) => {
  localStorage.setItem('currentPage', JSON.stringify(currentPageSeoName))
}

export const removeOrganizationInfoToLocal = () => {
  localStorage.removeItem('organizationInfo')
}

export const getOrganizationFromLocal: (
  initialOrganizationState: IOrganization | null
) => IOrganization | null = (initialOrganizationState) => {
  return localStorage.getItem('organizationInfo')
    ? JSON.parse(localStorage.getItem('organizationInfo') as any)
    : initialOrganizationState
}

export const getSiteFromLocal: (initialSiteState: ISite) => ISite = (
  initialSiteState
) => {
  return localStorage.getItem('siteInfo')
    ? JSON.parse(localStorage.getItem('siteInfo') as any)
    : initialSiteState
}

export const getUserFromLocal: (initialSiteState: IUser) => IUser = (
  initialSiteState
) => {
  return localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as any)
    : initialSiteState
}

export const getResourceFromLocal: (
  initialSiteState: IResource
) => IResource = (initialSiteState) => {
  return localStorage.getItem('resourceInfo')
    ? JSON.parse(localStorage.getItem('resourceInfo') as any)
    : initialSiteState
}

export const getRowTableFromLocal: (initialRowTableState: number) => number = (
  initialRowTableState
) => {
  return localStorage.getItem('rowTable')
    ? Number(JSON.parse(localStorage.getItem('rowTable') as any))
    : initialRowTableState
}

export const getLayoutColorFromLocal: (
  initialLayoutColor: LayoutColor
) => LayoutColor = (intialLayoutColor) => {
  return localStorage.getItem('layoutColor')
    ? JSON.parse(localStorage.getItem('layoutColor') as any)
    : intialLayoutColor
}

export const getLeftSideBarThemeFromLocal: (
  initialLeftSideBar: SideBarTheme
) => SideBarTheme = (initialLeftSideBar) => {
  return localStorage.getItem('leftSideBarTheme')
    ? JSON.parse(localStorage.getItem('leftSideBarTheme') as any)
    : initialLeftSideBar
}

export const getLeftSideBarTypeFromLocal: (
  initialLeftSidebarType: SideBarWidth
) => SideBarWidth = (initialLeftSidebarType) => {
  return localStorage.getItem('leftSideBarType')
    ? JSON.parse(localStorage.getItem('leftSideBarType') as any)
    : initialLeftSidebarType
}

export const getAggregatorFromLocal: (
  initialAggregatorState: IAggregator | null
) => IAggregator | null = (initialAggregatorState) => {
  return localStorage.getItem('aggregatorInfo')
    ? JSON.parse(localStorage.getItem('aggregatorInfo') as any)
    : initialAggregatorState
}

export const getMarketplaceFromLocal: (
  initialMarketplaceState: IMarketplace | null
) => IMarketplace | null = (initialMarketplaceState) => {
  return localStorage.getItem('marketplaceInfo')
    ? JSON.parse(localStorage.getItem('marketplaceInfo') as any)
    : initialMarketplaceState
}

export const getMarketplaceRelationshipFromLocal: (
  initialMarketplaceRelationshipState: IMarketplaceRelationship | null
) => IMarketplaceRelationship | null = (
  initialMarketplaceRelationshipState
) => {
  return localStorage.getItem('marketplaceRelationshipInfo')
    ? JSON.parse(localStorage.getItem('marketplaceRelationshipInfo') as any)
    : initialMarketplaceRelationshipState
}

export const getAccordionFromLocal: (
  initialAccordionState: IAccordion
) => IAccordion = (initialAccordionState) => {
  return localStorage.getItem('accordionInfo')
    ? JSON.parse(localStorage.getItem('accordionInfo') as any)
    : initialAccordionState
}

export const getPagesInfoFromLocal: (
  initialPagesInfoState: IPageStoreInformation
) => IPageStoreInformation = (initialPagesInfoState) => {
  if (localStorage.getItem('pagesInfo')) {
    const parseObject = JSON.parse(localStorage.getItem('pagesInfo') as any)
    if (parseObject) {
      const checkSameKeysParseObject = Object.keys(parseObject).every(
        (key) => key in initialPagesInfoState
      )
      const checkSameKeysInitialObject = Object.keys(
        initialPagesInfoState
      ).every((key) => key in parseObject)
      if (checkSameKeysInitialObject && checkSameKeysParseObject === false) {
        return initialPagesInfoState
      } else {
        return parseObject
      }
    }
  } else return initialPagesInfoState
}

export const getIntegrationInfoFromLocal: (
  initialIntegrationState?: IIntegration | null
) => IIntegration | null = (initialIntegrationState) => {
  return localStorage.getItem(MARKETPLACE_INTEGRATION_KEY)
    ? JSON.parse(localStorage.getItem(MARKETPLACE_INTEGRATION_KEY) as any)
    : initialIntegrationState
}

export const getNavigateInfoFromLocal = (initialCurrentPageSeoName: string) => {
  return localStorage.getItem('currentPage')
    ? JSON.parse(localStorage.getItem('currentPage') as any)
    : initialCurrentPageSeoName
}
