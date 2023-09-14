import faker from '@faker-js/faker'
import {
  IPropertyLocale,
  IProductDetail,
  IProductPrice,
  IWarehouseProductStock,
  IPropertyGeneric,
} from '../../interface/products'
import {IAssignedProducts} from '../../interface/assignedProduct'
import {mockAssignMarketplaces} from './marketplaces'

export const mockProduct = () => {
  return {
    id: faker.random.word(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    erpId: faker.datatype.string(),
    name: faker.random.word(),
    status: faker.datatype.string(),
  }
}

export const mockProducts = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockProduct()),
      totalElements: 10,
    },
  }
}

export const mockPropertyLocale = (): IPropertyLocale => {
  return {
    locale: faker.datatype.string(),
    propertyLocales: [
      {
        id: faker.datatype.string(),
        localeId: faker.datatype.string(),
        localeName: faker.datatype.string(),
        property: {
          id: null,
          erpId: null,
          createdAt: null,
          modifiedAt: null,
          name: null,
          version: null,
          status: null,
          type: 'Long string',
          localeSensitive: null,
        },
        value: faker.datatype.string(),
      },
    ],
  }
}

export const mockPropertyGeneric = (): IPropertyGeneric => {
  return {
    id: faker.datatype.string(),
    localeId: faker.datatype.string(),
    localeName: faker.datatype.string(),
    value: faker.datatype.string(),
    property: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      erpId: faker.datatype.string(),
      localeSensitive: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      name: faker.datatype.string(),
      status: faker.datatype.string(),
      type: 'Long string',
      version: faker.datatype.number()
    }
  }
}

export const mockProductDetail = (): IProductDetail => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    erpId: faker.datatype.string(),
    name: faker.datatype.string(),
    status: faker.datatype.string(),
    organizationErpId: faker.datatype.string(),
    organizationName: faker.datatype.string(),
    propertyLocales: Array.apply(null, Array(10)).map(() =>
      mockPropertyLocale()
    ),
    propertyGenerics: Array.apply(null, Array(10)).map(() =>
      mockPropertyGeneric()
    ),
  }
}

export const mockWarehouseProductStock = (): IWarehouseProductStock => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    modifiedBy: faker.datatype.string(),
    stockLevel: faker.datatype.number(),
    version: faker.datatype.number(),
    warehouseName: faker.datatype.string(),
  }
}

export const mockMultipleWarehouseProductStock =
  (): IWarehouseProductStock[] => {
    return Array.apply(null, Array(10)).map(() => mockWarehouseProductStock())
  }

export const mockProductPrice = (): IProductPrice => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    modifiedBy: faker.datatype.string(),
    version: faker.datatype.number(),
    currency: faker.datatype.string(),
    locale: faker.datatype.string(),
    site: faker.datatype.string(),
    salesPrice: faker.datatype.number(),
    rrp: faker.datatype.number(),
  }
}

export const mockMultipleProductPrice = (): IProductPrice[] => {
  return Array.apply(null, Array(10)).map(() => mockProductPrice())
}

export const mockMarketplaceProduct = (): any => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    modifiedBy: faker.datatype.string(),
    version: faker.datatype.number(),
    sellingPrice: faker.datatype.string(),
    currency: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      name: faker.datatype.string(),
      version: faker.datatype.number(),
    },
    listingQuantity: faker.datatype.string(),
    listingState: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      version: faker.datatype.number(),
      delist: faker.datatype.boolean(),
      errorCode: faker.datatype.string(),
      errorMessage: faker.datatype.string(),
      listedDate: faker.datatype.string(),
    },
    marketplace: {
      id: faker.datatype.string(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      name: faker.datatype.string(),
      version: faker.datatype.number(),
    },
  }
}

export const mockMarketplaceProducts = (): any[] => {
  return Array.apply(null, Array(10)).map(() => mockMarketplaceProduct())
}

export const mockAssignedProduct = (): IAssignedProducts => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    status: 'Active',
    erpId: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    marketplaces: mockAssignMarketplaces().data.content,
  }
}

export const mockAssignedProducts = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockAssignedProduct()),
      totalElements: 10,
    },
  }
}

export const mockAssignedProductsResponse = () => {
  return {
    data: {
      assignedMarketplaceProductIds: Array.apply(null, Array(10)).map(() =>
        faker.datatype.string()
      ),
      unassignedMarketplaceProductIds: Array.apply(null, Array(10)).map(() =>
        faker.datatype.string()
      ),
    },
  }
}
