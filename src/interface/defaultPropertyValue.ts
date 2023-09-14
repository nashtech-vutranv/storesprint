import {IBaseEntities, IBaseEntitiesOmitNameAndErpId} from '.'

interface IDefaultProperty extends IBaseEntities {
  type: string
  localeSensitive: boolean
  status: string
}

interface IDefaultPropertyValue extends IBaseEntitiesOmitNameAndErpId {
  localeId: string
  localeName: string
  organizationId: string
  organizationName: string
  propertyId: string
  propertyName: string
  defaultValue: string
  status: string
}

interface ICreateUpdateDefaultPropertyValue {
  id: string
  localeId?: string
  organizationId: string
  propertyId: string
  defaultValue: string
  status: string
  version: number
}

export type {
  IDefaultPropertyValue,
  IDefaultProperty,
  ICreateUpdateDefaultPropertyValue,
}
