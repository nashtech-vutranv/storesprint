import {
  createContext,
  FC,
  useReducer,
  Dispatch,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import Keycloak, {KeycloakInstance} from 'keycloak-js'
import {usePermissions} from '../hooks'
import {
  IOrganization,
  ISite,
  IResource,
  IUser,
  IAggregator,
  IMarketplace,
  IMarketplaceRelationship,
  IAccordion,
  IPageStoreInformation,
  IPermissionInformation,
  IPreviousPage,
} from '../interface'
import {
  handleMarketplaceIntegrate,
  getOrganizationFromLocal,
  getSiteFromLocal,
  getUserFromLocal,
  getResourceFromLocal,
  getRowTableFromLocal,
  storeKeyCloakToLocal,
  getAggregatorFromLocal,
  getMarketplaceFromLocal,
  getMarketplaceRelationshipFromLocal,
  getAccordionFromLocal,
  getPagesInfoFromLocal,
  getNavigateInfoFromLocal,
  getPreviousPageInfoFromSession,
} from '../helpers'
import {GlobalConfig} from '../global'
import {
  IOrganizationAction,
  ISiteAction,
  IUserAction,
  IResourceAction,
  IRowTableActionType,
  LayoutActionType,
  LayoutStateType,
  IAggregatorAction,
  IMarketplaceAction,
  IMarketplaceRelationshipAction,
  IAccordionActionType,
  IPagesInfoActionType,
  ModalStateType,
  ModalActionType,
  INavigationAction,
  IPreviousPageActionType,
} from './actions'
import {
  organizationReducer,
  organizationInitialState,
  siteReducer,
  siteInitialState,
  userInitialState,
  userReducer,
  resourceInitialState,
  resourceReducer,
  rowTableReducer,
  rowTableInitialState,
  aggregatorInitialState,
  aggregatorReducer,
  layoutReducer,
  layoutInitState,
  marketplaceInitialState,
  marketplaceReducer,
  marketplaceRelationshipInitialState,
  marketplaceRelationshipReducer,
  accordionInitialState,
  accordionReducer,
  pagesInfoReducer,
  pageStoreInitialState,
  modalReducer,
  modalInitialState,
  navigateReducer,
  navigateInitialState,
  previousPageReducer,
  previousPageInitialState,
} from './reducers'

interface IGlobalContext {
  state: {
    layout: LayoutStateType
    auth: KeycloakInstance | null
    organization: IOrganization | null
    site: ISite
    user: IUser
    resource: IResource | null
    aggregator: IAggregator | null
    marketplace: IMarketplace | null
    marketplaceRelationship: IMarketplaceRelationship | null
    axiosClient: AxiosInstance
    rowTable: number
    accordion: IAccordion
    pagesInfo: IPageStoreInformation
    localStorageVer: number
    modal: ModalStateType
    currentPage: string
    permissionInformations: IPermissionInformation
    previousPage: IPreviousPage | null
  }
  dispatch: {
    organization: Dispatch<IOrganizationAction>
    site: Dispatch<ISiteAction>
    layout: Dispatch<LayoutActionType<any>>
    user: Dispatch<IUserAction>
    resource: Dispatch<IResourceAction>
    rowTable: Dispatch<IRowTableActionType<number>>
    aggregator: Dispatch<IAggregatorAction>
    marketplace: Dispatch<IMarketplaceAction>
    marketplaceRelationship: Dispatch<IMarketplaceRelationshipAction>
    accordion: Dispatch<IAccordionActionType<IAccordion>>
    pagesInfo: Dispatch<IPagesInfoActionType<any>>
    modal: Dispatch<ModalActionType>
    currentPage: Dispatch<INavigationAction<string>>
    previousPage: Dispatch<IPreviousPageActionType<IPreviousPage | null>>
  }
}

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
})

const setTokenForUPS = (keycloakValue: KeycloakInstance | null) => {
  localStorage.setItem('token', keycloakValue?.token || '')
}

const globalInitialContext: IGlobalContext = {
  state: {
    layout: layoutInitState,
    auth: null,
    organization: getOrganizationFromLocal(organizationInitialState),
    site: getSiteFromLocal(siteInitialState),
    user: getUserFromLocal(userInitialState),
    resource: getResourceFromLocal(resourceInitialState),
    aggregator: getAggregatorFromLocal(aggregatorInitialState),
    axiosClient,
    rowTable: getRowTableFromLocal(rowTableInitialState),
    marketplace: getMarketplaceFromLocal(marketplaceInitialState),
    marketplaceRelationship: getMarketplaceRelationshipFromLocal(
      marketplaceRelationshipInitialState
    ),
    accordion: getAccordionFromLocal(accordionInitialState),
    pagesInfo: getPagesInfoFromLocal(pageStoreInitialState),
    modal: modalInitialState,
    currentPage: getNavigateInfoFromLocal(navigateInitialState),
    localStorageVer: 2.5,
    permissionInformations: {
      appCode: 'mms',
      handleChangeAppCode: () => {},
      permissionCodes: [],
      permissions: [],
      isLoadingPermission: null,
      checkPermissionIsAssignedToLocaleBySelectedOrgAndSite: () => false,
      checkPermissionIsAssignedToOrg: () => false,
      hasUpsPermissions: false,
    },
    previousPage: getPreviousPageInfoFromSession(previousPageInitialState),
  },
  dispatch: {
    organization: () => {
      // do smt
    },
    site: () => {
      // do smt
    },
    user: () => {
      // do smt
    },
    resource: () => {
      // do smt
    },
    layout: () => {
      // do smt
    },
    rowTable: () => {
      // do smt
    },
    aggregator: () => {
      // do smt
    },
    marketplace: () => {
      // do smt
    },
    marketplaceRelationship: () => {
      // do smt
    },
    accordion: () => {
      // do smt
    },
    pagesInfo: () => {
      // do smt
    },
    modal: () => {
      // do smt
    },
    currentPage: () => {
      // do smt
    },
    previousPage: () => {
      // do smth
    },
  },
}

const GlobalContext = createContext<IGlobalContext>(globalInitialContext)

GlobalContext.displayName = 'GlobalState'

const GlobalContextProvider: FC<{children: ReactNode}> = ({children}) => {
  const [keycloakValue, setKeycloakValue] = useState<KeycloakInstance | null>(
    null
  )
  const {
    appCode,
    handleChangeAppCode,
    permissions,
    permissionCodes,
    checkHasPermissions,
    isLoadingPermission,
    hasUpsPermissions,
    checkPermissionIsAssignedToLocaleBySelectedOrgAndSite,
    checkPermissionIsAssignedToOrg,
  } = usePermissions(keycloakValue)

  const updateToken = useCallback(
    (
      applyTokenToAllRequestHeader: () => AxiosRequestConfig<any>,
      keyCloakObj: KeycloakInstance
    ) =>
      keyCloakObj
        .updateToken(60)
        .then(applyTokenToAllRequestHeader)
        .catch(() => {
          keycloakValue?.login()
          storeKeyCloakToLocal(keyCloakObj)
        }),
    [keycloakValue]
  )

  const handleAccessToken = useCallback(
    (keyCloakObj: KeycloakInstance) => {
      axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
        const applyTokenToAllRequestHeader = () => {
          if (config.headers)
            config.headers.Authorization = `Bearer ${keyCloakObj.token}`
          return config
        }
        return updateToken(applyTokenToAllRequestHeader, keyCloakObj)
      })
    },
    [updateToken]
  )

  const setKeycloak = () => {
    const configs = GlobalConfig().config
    const keycloak: KeycloakInstance = new (Keycloak as any)({
      url: configs.REACT_APP_URL_KEYCLOAK,
      realm: configs.REACT_APP_REALM,
      clientId: configs.REACT_APP_CLIENT_ID,
    })

    if (
      window.location.pathname === '/marketplace-integration' &&
      window.location.search
    ) {
      handleMarketplaceIntegrate()
    } else {
      keycloak
        .init({
          onLoad: 'login-required',
        })
        .then(() => {
          setKeycloakValue(keycloak)
          handleAccessToken(keycloak)
          storeKeyCloakToLocal(keycloak)
          setTokenForUPS(keycloak)
        })
    }
  }

  const [organization, organizationDispatch] = useReducer(
    organizationReducer,
    getOrganizationFromLocal(organizationInitialState)
  )
  const [site, siteDispatch] = useReducer(
    siteReducer,
    getSiteFromLocal(siteInitialState)
  )
  const [user, userDispatch] = useReducer(
    userReducer,
    getUserFromLocal(userInitialState)
  )
  const [resource, resourceDispatch] = useReducer(
    resourceReducer,
    getResourceFromLocal(resourceInitialState)
  )
  const [aggregator, aggregatorDispatch] = useReducer(
    aggregatorReducer,
    getAggregatorFromLocal(aggregatorInitialState)
  )

  const [marketplace, marketplaceDispatch] = useReducer(
    marketplaceReducer,
    getMarketplaceFromLocal(marketplaceInitialState)
  )

  const [marketplaceRelationship, marketplaceRelationshipDispatch] = useReducer(
    marketplaceRelationshipReducer,
    getMarketplaceRelationshipFromLocal(marketplaceRelationshipInitialState)
  )

  const [layout, layoutDispatch] = useReducer(layoutReducer, layoutInitState)

  const [rowTable, rowTableDispatch] = useReducer(
    rowTableReducer,
    rowTableInitialState
  )

  const [accordion, accordionDispatch] = useReducer(
    accordionReducer,
    accordionInitialState
  )

  const [pagesInfo, pagesInfoDispatch] = useReducer(
    pagesInfoReducer,
    pageStoreInitialState
  )

  const [modal, modalDispatch] = useReducer(modalReducer, modalInitialState)

  const [currentPage, currentPageDispatch] = useReducer(
    navigateReducer,
    navigateInitialState
  )

  const [previousPage, previousPageDispatch] = useReducer(
    previousPageReducer,
    previousPageInitialState
  )

  useEffect(() => {
    setKeycloak()
  }, [])

  useEffect(() => {
    if (keycloakValue) {
      const interval = setInterval(() => {
        keycloakValue.updateToken(60).then(() => {
          setTokenForUPS(keycloakValue)
        })
      }, 40000)
      return () => {
        clearInterval(interval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloakValue])

  useEffect(() => {
    if (keycloakValue) {
      keycloakValue.updateToken(60).then(() => {
        setTokenForUPS(keycloakValue)
      })
    }
  }, [appCode])

  return (
    <GlobalContext.Provider
      value={{
        state: {
          layout,
          auth: keycloakValue,
          organization,
          site,
          user,
          resource,
          aggregator,
          axiosClient,
          marketplace,
          marketplaceRelationship,
          rowTable,
          accordion,
          pagesInfo,
          modal,
          currentPage,
          localStorageVer: globalInitialContext.state.localStorageVer,
          permissionInformations: {
            appCode,
            handleChangeAppCode,
            permissionCodes,
            permissions,
            checkHasPermissions,
            isLoadingPermission,
            checkPermissionIsAssignedToLocaleBySelectedOrgAndSite,
            checkPermissionIsAssignedToOrg,
            hasUpsPermissions,
          },
          previousPage,
        },
        dispatch: {
          organization: organizationDispatch,
          site: siteDispatch,
          user: userDispatch,
          resource: resourceDispatch,
          layout: layoutDispatch,
          rowTable: rowTableDispatch,
          aggregator: aggregatorDispatch,
          marketplace: marketplaceDispatch,
          marketplaceRelationship: marketplaceRelationshipDispatch,
          accordion: accordionDispatch,
          pagesInfo: pagesInfoDispatch,
          modal: modalDispatch,
          currentPage: currentPageDispatch,
          previousPage: previousPageDispatch,
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export {organizationInitialState, GlobalContext, GlobalContextProvider}
