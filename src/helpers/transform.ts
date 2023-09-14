import {
  IProductDetail,
  IPropertyForm,
  IFormData,
  IPropertyChild,
  IPropertyGeneric,
  PropertyType,
  IProductCategoryShorten,
  IMarketplaceProductCategory,
  IMarketplaceType,
  IProductCategoryDetailResponseData,
  ISelectProductCategoryMapping,
} from '../interface'

const mappingProperties: (
  propertyChild: IPropertyChild | IPropertyGeneric
) => IPropertyForm = (prop) => ({
  id: prop.id,
  value: prop.value,
  type: prop.property.type,
  propertyErpId: prop.property.erpId,
  localeName: prop.localeName
})

export const transformProductDetailDataToForm: (
  _productDetail: IProductDetail
) => IFormData = (productDetail) => {
  const {name} = productDetail
  const genericProperties: IPropertyForm[] = productDetail.propertyGenerics.map(
    (propGeneric) => mappingProperties(propGeneric)
  )
  let localeProperties: IPropertyForm[] = []
  productDetail.propertyLocales.forEach((propLocale) => {
    localeProperties = [
      ...localeProperties,
      ...propLocale.propertyLocales.map((pr) => mappingProperties(pr)),
    ]
  })
  return {
    name,
    localeProperties,
    genericProperties,
  }
}

export const transformInputData = (value: any, propertyType: PropertyType) => {
  switch(propertyType) {
    case 'Number': return Number(value)
    default: return value
  }
}

export const transformProductCategoryFormData = (
  productCategories: IProductCategoryShorten[]
) => {
  return productCategories.map((pdc) => ({
    value: pdc.id,
    label: pdc.value,
  }))
}

export const transformProductCategorySingleElement = (productCategory: string) => {
  return ({
    value: productCategory,
    label: productCategory
  })
}

export const transformMarketplaceTypeFormData = (marketplaceTypes: Array<Omit<IMarketplaceType, 'name'> & {name: string}>) => {
  return marketplaceTypes.map((mrT) => ({
    value: mrT.id,
    label: mrT.name
  }))
}

export const transformMarketplaceTypeFormDataSingleElement = (
  marketplaceType: Omit<IMarketplaceType, 'name'> & {name: string}
) => {
  return ({
    value: marketplaceType.id,
    label: marketplaceType.name
  })
}

export const transformMarketplaceProductCategoryFormData = (
  marketplaceProductCategories: IMarketplaceProductCategory[]) => {
    return marketplaceProductCategories.map((mpc) => ({
      value: mpc.id,
      label: mpc.marketplaceValue,
      code: mpc.marketplaceCode
    }))
}

export const transformMarketplaceProductCategoriesOptionToSelectData: (
  marketplaceProductCategories: IMarketplaceProductCategory[]
) => ISelectProductCategoryMapping[] = (
  marketplaceProductCategories
) => {
  return marketplaceProductCategories.map((mpc) => ({
    value: mpc.id,
    label: mpc.marketplaceValue,
    code: mpc.marketplaceCode,
    splitPropertyName: null,
    splitProperty: null,
    splitValue: null,
    propertyValuesOption: []
  }))
}

export const transformProductCategoryDetailToSelectData: (
  productCategoryMappingDetail: IProductCategoryDetailResponseData
) => ISelectProductCategoryMapping[] = (
  productCategoryMappingDetail
) => {
  return productCategoryMappingDetail.productPropertyValues.map((item) => ({
    value: item.mappingTargetId,
    label: item.marketplaceValue,
    code: item.marketplaceCode,
    splitProperty: item.splitProperty,
    splitValue: item.splitValue,
    splitPropertyName: item.splitPropertyName,
    propertyValuesOption: []
  }))
}

export const transformMarketplaceProductPropertyFormData = (productProperties: any[]) => {
  return productProperties.map((pdp) => ({
    value: pdp.id,
    label: pdp.name,
    erpId: pdp.erpId,
    propertyId: pdp.id
  }))
}