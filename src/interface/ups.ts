interface ICommonErpIdString {
  erpId: string
  id: string
}

export type AppCode = 'mms' | 'ups'

export interface IPermission {
  code: string
  id: string
  needOrganization: boolean
  needSite: boolean
  locationContexts: ILocationContext[]
  appCode: AppCode
}

export interface ILocationContext {
  organization: ICommonErpIdString
  site?: ICommonErpIdString
  locale?: ICommonErpIdString
}

export interface IPermissionInformation {
  appCode: AppCode
  handleChangeAppCode: (appCode: AppCode) => void
  permissions: IPermission[]
  permissionCodes: string[]
  checkHasPermissions?: (codes: string[]) => boolean
  isLoadingPermission: boolean | null
  hasUpsPermissions: boolean
  checkPermissionIsAssignedToLocaleBySelectedOrgAndSite?: (
    _permissions: IPermission[],
    currentPermission: string,
    currentOrgErpId: string,
    currentSiteErpId: string,
    currentLocaleErpId: string
  ) => boolean
  checkPermissionIsAssignedToOrg?: (
    _permissions: IPermission[],
    currentPermission: string,
    currentOrgErpId: string | undefined
  ) => boolean
}
