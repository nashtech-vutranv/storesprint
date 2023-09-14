import {ISelectOption} from './selectOption'
import {IBaseEntitiesOmitNameAndErpId} from '.'

interface IProductCategoryMappings extends IBaseEntitiesOmitNameAndErpId {
  marketplaceTypeId: string | null
  mappingTypeId: string | null
  mmsValue: string
  marketplaceValue: string | null
  marketplaceType: {
    id: string
    name: string
  } | null
  mappingType: {
    id: string
    name: string
  } | null
  mappingTarget: {
    id: string
    mappingTypeId: string
    marketplaceCode: string
    marketplaceTypeId: string
    marketplaceValue: string
  } | null
}

interface IProductCategory extends IBaseEntitiesOmitNameAndErpId {
  value: string
  organizationId: string
  parentId: string
  propertyId: string
}

interface IProductCategoryShorten
  extends Omit<IProductCategory, 'createdAt' | 'modifiedAt' | 'version'> {}

interface ISelectProductCategory {
  name: string
  id: string | null
}

interface ISelectMarketplaceProductCategory extends ISelectProductCategory {}

interface ISelectMarketplaceType extends ISelectProductCategory {
  id: string
}

interface ISelectProductCategoryMapping extends ISelectOption {
  code: string | null
  splitProperty: string | null
  splitPropertyName: string | null
  splitValue: string | null
  propertyValuesOption: ISelectOption[]
}

interface IUpdateProductCategoryMapping {
  version: number
  marketplaceTypeId: string
  mmsValue: string
  marketplaceValue: string
  marketplaceCode?: string | null
}

interface IProductPropertyValue {
  marketplaceValue: string
  marketplaceCode: string
  splitProperty: string | null
  splitPropertyName: string | null
  splitValue: string | null
}

interface IAddProductCategoriesMappingCommon {
  version: number
  marketplaceTypeId: string | null
  mmsValue: string | null
  mappingTypeId: string | null
  organizationId: string | null
}

interface IUpdateProductCategoriesMappingCommon {
    version: number
    marketplaceTypeId: string
    mmsValue: string
    mappingTypeId: string
}
interface IAddProductCategoriesMapping
  extends IAddProductCategoriesMappingCommon {
  productPropertyValues: IProductPropertyValue[]
}

interface IAddProductCategoriesMappingForm
  extends IAddProductCategoriesMappingCommon {
  productPropertyValues: ICategoryMappingTableRow[]
}

interface IUpdateProductCategoriesMapping
  extends IUpdateProductCategoriesMappingCommon {
  productPropertyValues: IProductPropertyValue[]
}

interface IUpdateProductCategoriesMappingForm
  extends IUpdateProductCategoriesMappingCommon {
  productPropertyValues: Array<
    IProductPropertyValue & {
      id: string
      splitPropertyName: string
      propertyValuesOption: ISelectOption[]
    }
  >
}

interface IProductCategoryDetailResponseData {
  mmsValue: string
  marketplaceType: {
    id: string
    name: string
  }
  mappingType: {
    id: string
    name: string
  }
  productPropertyValues: Array<IProductPropertyValue & {mappingTargetId: string, splitPropertyName: string}>
}

interface IProductCategoryDetailRequestData {
  version: number
  mmsValue: string
  marketplaceTypeId: string
  mappingTypeId: string
  productPropertyValues: Array<{
    marketplaceValue: string
    marketplaceCode: string
    splitProperty: string | null
    splitValue: string | null
  }>
}

interface ICategoryMappingTableRow extends IProductPropertyValue {
  id: string
  splitPropertyId: string | null
  propertyValuesOption: ISelectOption[]
}

type ICategoryMappingTableList = ICategoryMappingTableRow[]

interface IUpdateCategoryMappingTableRow extends IProductPropertyValue {
    id: string
}

type IUpdateCategoryMappingTableList = IUpdateCategoryMappingTableRow[]

interface ISplitPropertyValue {
  values: string[]
  property: {
    id: string
    createdAt: string
    modifiedAt: string
    version: number
    erpId: string
    name: string
    type: string
  }
}

type ISplitPropertyValues = ISplitPropertyValue[]

interface IMarketplaceProductCategory {
  id: string
  marketplaceTypeId: string
  mappingTypeId: string
  marketplaceValue: string
  marketplaceCode: string
}

interface IMarketplaceMapping extends IBaseEntitiesOmitNameAndErpId {
  marketplaceTypeId: string
  mappingTypeId: string
  mmsValue: string
  marketplaceValue: string
  marketplaceType: {
    id: string
    name: string
  }
  mappingType: {
    id: string
    name: string
  }
  mappingTarget: {
    id: string
    marketplaceTypeId: string
    mappingTypeId: string
    marketplaceValue: string
    marketplaceCode: string
  }
}

interface ICurrentSelectProperty {
  rowId?: string
  propertyId: string
}

export type {}

export type {
  IProductCategoryMappings,
  IProductCategory,
  IProductCategoryShorten,
  IProductPropertyValue,
  IUpdateProductCategoryMapping,
  IAddProductCategoriesMapping,
  IAddProductCategoriesMappingForm,
  IUpdateProductCategoriesMapping,
  IUpdateProductCategoriesMappingForm,
  IProductCategoryDetailResponseData,
  IProductCategoryDetailRequestData,
  ICategoryMappingTableList,
  IUpdateCategoryMappingTableList,
  ICategoryMappingTableRow,
  IUpdateCategoryMappingTableRow,
  ISplitPropertyValue,
  ISplitPropertyValues,
  IMarketplaceProductCategory,
  ISelectProductCategory,
  ISelectMarketplaceProductCategory,
  ISelectMarketplaceType,
  ISelectProductCategoryMapping,
  IMarketplaceMapping,
  ICurrentSelectProperty,
}
