import faker from '@faker-js/faker'
import {
  IProductCategoryMappings,
  IMarketplaceProductCategory,
  IProductCategoryShorten,
  IUpdateProductCategoryMapping,
  IAddProductCategoriesMapping,
  ISplitPropertyValue,
  ISplitPropertyValues,
  IProductPropertyValue,
  IProductCategoryDetailResponseData,
} from '../../interface'

export const mockProductCategoryMappings = (): IProductCategoryMappings => {
  return {
    id: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    version: faker.datatype.number(),
    mappingType: {
      id: faker.datatype.string(),
      name: faker.datatype.string()
    },
    mappingTypeId: faker.datatype.string(),
    marketplaceType: {
      id: faker.datatype.string(),
      name: faker.datatype.string()
    },
    marketplaceTypeId: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    mappingTarget: {
      id: faker.datatype.string(),
      mappingTypeId: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
    }
  }
}

export const mockListProductCategoryMappings = () => {
  return Array.from(new Array(2)).map(() => mockProductCategoryMappings())
}

export const mockGetMappingTargetInProductCategory: () => IMarketplaceProductCategory[] = () => {
    return Array.apply(null, Array(10)).map(() => ({
      id: faker.datatype.string(),
      marketplaceTypeId: faker.datatype.string(),
      mappingTypeId: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
    }))
  }

export const mockGetProductCategory: () => IProductCategoryShorten[] = () => {
  return Array.apply(null, Array(10)).map(() => ({
    id: faker.datatype.string(),
    value: faker.datatype.string(),
    organizationId: faker.datatype.string(),
    parentId: faker.datatype.string(),
    propertyId: faker.datatype.string(),
  }))
}

export const mockAddProductCategoryMapping: () => IUpdateProductCategoryMapping = () => {
  return {
    version: faker.datatype.number(),
    marketplaceTypeId: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    marketplaceValue: faker.datatype.string(),
    marketplaceCode: faker.datatype.string(),
  }
}

export const mockPropertyValue: () => IProductPropertyValue = () => {
  return {
    marketplaceValue: faker.datatype.string(),
    marketplaceCode: faker.datatype.string(),
    splitProperty: faker.datatype.string(),
    splitValue: faker.datatype.string(),
    splitPropertyName: faker.datatype.string()
  }
}

export const mockAddProductCategoriesMapping: () => IAddProductCategoriesMapping = () => {
  return {
    version: faker.datatype.number(),
    marketplaceTypeId: faker.datatype.string(),
    mmsValue: faker.datatype.string(),
    mappingTypeId: faker.datatype.string(),
    organizationId: faker.datatype.string(),
    productPropertyValues: Array.apply(null, Array(10)).map(() => mockPropertyValue()),
  }
}

export const mockEditProductCategoryMapping: () => IUpdateProductCategoryMapping =
  () => {
    return {
      version: faker.datatype.number(),
      marketplaceTypeId: faker.datatype.string(),
      mmsValue: faker.datatype.string(),
      marketplaceValue: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
    }
  }

export const mockSplitValue: () => ISplitPropertyValue = () => {
  return (
    {
      values: [faker.datatype.string(), faker.datatype.string()],
      property: {
        id: faker.datatype.string(),
        createdAt: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        version: faker.datatype.number(),
        erpId: faker.datatype.string(),
        name: faker.datatype.string(),
        type: faker.datatype.string()
      }
    }
  )
}

export const mockSplitValues: () => ISplitPropertyValues = () => {
  return Array.apply(null, Array(10)).map(() => mockSplitValue())
}

export const mockGetProductCategoryMapping: () => IProductCategoryDetailResponseData = () => {
  return {
    mmsValue: faker.datatype.string(),
    marketplaceType: {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
    },
    mappingType: {
      id: faker.datatype.string(),
      name: faker.datatype.string(),
    },
    productPropertyValues: Array.apply(null, Array(10)).map(() => ({
      marketplaceValue: faker.datatype.string(),
      marketplaceCode: faker.datatype.string(),
      splitProperty: faker.datatype.string(),
      splitValue: faker.datatype.string(),
      mappingTargetId: faker.datatype.string(),
      splitPropertyName: faker.datatype.string()
    })),
  }
}