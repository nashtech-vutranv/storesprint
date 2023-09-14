interface IUrlParams {
  orgLs?: string
  orgVs?: string
  siteLs?: string
  siteVs?: string
  localeLs?: string
  localeVs?: string
  mrkLs?: string
  mrkVs?: string
  rosLs?: string
  rosVs?: string
  stLs?: string
  stVs?: string
  search?: string
  page?: number
  sortField?: string
  sortOrder?: string
  collapse?: string
  currentStatus?: string
  first?: string
  marketplaceTypeValue?: string
  marketplaceTypeLabel?: string
  propertyValues?: string
  propertyLabels?: string
  pcLs?: string
  pcVs?: string
  lsLs?: string
  lsVs?: string
}

type CommonStateUrlParams = 'search' | 'page' | 'sortField' | 'sortOrder' | 'collapse' | 'currentStatus' | 'first'

type ISelectUrlParam = keyof IUrlParams

type ParamType = 'org' | 'site' | 'locale' | 'mrk' | 'ros' | 'st' | 'marketplaceType' | 'property' | 'productCategory' | 'listingStatus'

export type {ISelectUrlParam, IUrlParams, ParamType, CommonStateUrlParams}