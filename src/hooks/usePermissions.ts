import {KeycloakInstance} from 'keycloak-js'
import {useContext, useEffect, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {AxiosError} from 'axios'
import {AppCode, IPermission} from '../interface'
import {GlobalContext} from '../store/GlobalContext'
import useHandleError from './useHandleError'

export default function usePermissions(keycloak: KeycloakInstance | null) {
  const {
    state: {axiosClient},
  } = useContext(GlobalContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoadingPermission, setIsloadingPermission] = useState<
    boolean | null
  >(null)
  const [appCode, setAppCode] = useState<AppCode>('mms')
  const [permissions, setPermissions] = useState<IPermission[]>([])
  const [permissionCodes, setPermissionCodes] = useState<string[]>([])
  const [hasUpsPermissions, setHasUpsPermissions] = useState<boolean>(false)

  const {handleErrorResponse} = useHandleError()

  const handleGetPermissions = async (
    _appCode: AppCode,
    useLoading: boolean = true
  ) => {
    try {
      useLoading && setIsloadingPermission(true)
      const {data} = await axiosClient.get(
        `authz/users/permissions?appCode=${_appCode}`,
        {
          baseURL: '/ups/api/v1',
        }
      )
      return data
    } catch (error) {
      handleErrorResponse(error as AxiosError)
    } finally {
      useLoading && setIsloadingPermission(false)
    }
  }

  const checkHasPermissions = (codes: string[]) => {
    if (codes.length <= 0) {
      return false
    }
    return codes.every((x) => permissionCodes.includes(x))
  }

  const handleChangeAppCode = (_appCode: AppCode) => {
    setAppCode(_appCode)
  }

  const checkPermissionIsAssignedToLocaleBySelectedOrgAndSite = (
    _permissions: IPermission[],
    currentPermission: string,
    currentOrgErpId: string,
    currentSiteErpId: string,
    currentLocaleErpId: string
  ) => {
    const findPermission = _permissions.find(
      (p) => p.code === currentPermission
    )
    let isPermissionAssignedToLocale = false
    findPermission &&
      findPermission?.locationContexts.forEach((lc) => {
        const {organization, site, locale} = lc
        if (
          organization.erpId === currentOrgErpId &&
          site?.erpId === currentSiteErpId &&
          locale?.erpId === currentLocaleErpId
        )
          isPermissionAssignedToLocale = true
      })
    return isPermissionAssignedToLocale
  }

  const checkPermissionIsAssignedToOrg = (
    _permissions: IPermission[],
    currentPermission: string,
    currentOrgErpId: string | undefined
  ) => {
    const findPermission = _permissions.find(
      (p) => p.code === currentPermission
    )
    let isPermissionAssignedToLocale = false
    findPermission &&
      findPermission?.locationContexts.forEach((lc) => {
        const {organization} = lc
        if (organization.erpId === currentOrgErpId) {
          isPermissionAssignedToLocale = true
        }
      })
    return isPermissionAssignedToLocale
  }

  useEffect(() => {
    if (keycloak && keycloak.authenticated) {
      setPermissions([])
      setPermissionCodes([])
      handleGetPermissions(appCode).then((data) => {
        setPermissions(data.map((x:IPermission) => ({...x, appCode})))
        const codes = data.map((x: IPermission) => x.code)
        setPermissionCodes(codes)
      })
      if (
        (location.pathname.startsWith('/ups') && appCode === 'mms') ||
        (location.pathname !== '/' && appCode === 'ups')
      ) {
        navigate('/')
      }

      if (appCode === 'mms') {
        handleGetPermissions('ups', false).then((data) => {
          setHasUpsPermissions(data.length > 0)
        })
      }
    }
  }, [keycloak, appCode])

  return {
    appCode,
    handleChangeAppCode,
    permissions,
    permissionCodes,
    checkHasPermissions,
    isLoadingPermission,
    hasUpsPermissions,
    checkPermissionIsAssignedToLocaleBySelectedOrgAndSite,
    checkPermissionIsAssignedToOrg,
  }
}
