import {IBaseEntities, IBaseEntitiesOmitNameAndErpId} from '.'

type PropertyType = 'Long string' | 'String' | 'Number' | 'Boolean' | 'Date'

type IInputTextType = 'Long string' | 'String' | 'Number'

interface IProductTabItem {
  label: string
  key: string
}

interface IBaseProperty {
  id: string | null
  erpId: string | null
  createdAt: string | null
  modifiedAt: string | null
  name: string | null
  version: number | null
  status: string | null
}

interface IProperty extends IBaseProperty {
  type: PropertyType
  localeSensitive: string | null
}

interface IProducts extends IBaseEntities {
  status: string
}

interface IPropertyChild {
  id: string
  localeId: string
  localeName: string
  property: IProperty
  value: string | number | boolean
}

interface IPropertyLocale {
  locale: string
  propertyLocales: IPropertyChild[]
}

interface IPropertyGeneric extends Omit<IPropertyChild, 'value'> {
  value: string | number | boolean
}
interface IProductDetail extends IBaseEntities {
  status: string
  organizationErpId: string
  organizationName: string
  propertyLocales: IPropertyLocale[]
  propertyGenerics: IPropertyGeneric[]
}

interface IPropertyForm extends Pick<IPropertyGeneric, 'id' | 'value'> {
  propertyErpId: string | null
  type: PropertyType
}

interface IPropertyFormWithNewProperty extends Omit<IPropertyForm, 'id'> {
  id: string | number
  localeName?: null | string
}

interface IFormData {
  name: string
  localeProperties: IPropertyForm[]
  genericProperties: IPropertyForm[]
}

interface IUpdatePropertyDetailRequest
  extends Omit<IFormData, 'genericProperties' | 'localeProperties'> {
  genericProperties: IPropertyFormWithNewProperty[]
  localeProperties: IPropertyFormWithNewProperty[]
}

type IUpdatePropertyGenericFormErrors = {
  propertyName?: string
  propertyGenerics: Array<{
    id: string
    name: string
  }>
}

interface IWarehouseProductStock extends IBaseEntitiesOmitNameAndErpId {
  warehouseName: string
  stockLevel: number
  modifiedBy: string
}

interface IProductPrice extends IBaseEntitiesOmitNameAndErpId {
  modifiedBy: string
  site: string
  locale: string
  currency: string
  salesPrice: number
  rrp: number
}

export type {
  IProducts,
  IProductDetail,
  IPropertyLocale,
  IPropertyGeneric,
  IPropertyChild,
  IUpdatePropertyDetailRequest,
  IPropertyForm,
  IFormData,
  IUpdatePropertyGenericFormErrors,
  IWarehouseProductStock,
  IProductPrice,
  IProductTabItem,
  PropertyType,
  IInputTextType,
  IProperty,
  IPropertyFormWithNewProperty,
}
