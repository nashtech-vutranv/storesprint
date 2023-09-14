export const ROUTE_PARAMS = {
  ORG_ID: ':orgId',
  SITE_ID: ':siteId',
  SITE_LOCALE_ID: ':siteLocaleId',
  WAREHOUSE_ID: ':warehouseId',
  USER_ID: ':userId',
  RESOURCE_ID: ':resourceId',
  AGGREGATOR_ID: ':aggregatorId',
  MARKETPLACE_ID: ':marketplaceId',
  MARKETPLACE_RELATIONSHIP_ID: ':marketplaceRelationshipsId',
  PRODUCT_ID: ':productId',
  ORDER_ID: ':orderId',
  MARKETPLACE_TYPE_ID: ':marketplaceTypeId',
  MAPPING_TYPE_ID: ':mappingTypeId',
  PRODUCT_PROPERTY_ID: ':productPropertyId',
  DEFAULT_PROPERTY_VALUE_ID: ':defaultPropertyValueId',
  PRODUCT_CATEGORY_MAPPINGS_ID: ':productCategoryMappingsId',
  MAPPING_TARGET_ID: ':mappingTargetId',
  PRODUCT_PROPERTY_MAPPINGS_ID: ':productPropertyMappingsId',
  PRODUCT_PROPERTY_ATTRIBUTE_ID: ':productPropertyAttributeId',
  COURIER_MAPPING_ID: ':courierMappingId',
  MMS_PRODUCT_PROPERTY: ':mmsProductProperty',
  DELIVERY_TYPE_MAPPING_ID: ':deliveryTypeMappingId',
}

export const ROUTE_ORG = {
  ROOT: '/organizations',
  ADD: '/organizations/add',
  EDIT: `/organizations/${ROUTE_PARAMS.ORG_ID}`,
}

export const ROUTE_SITE = {
  ROOT: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites`,
  ADD: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites/add`,
  EDIT: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites/${ROUTE_PARAMS.SITE_ID}`,
}

export const ROUTE_SITE_LOCALE = {
  ROOT: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites/${ROUTE_PARAMS.SITE_ID}/locales`,
  ADD: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites/${ROUTE_PARAMS.SITE_ID}/locales/add`,
  EDIT: `/organizations/${ROUTE_PARAMS.ORG_ID}/sites/${ROUTE_PARAMS.SITE_ID}/locales/${ROUTE_PARAMS.SITE_LOCALE_ID}`,
}

export const ROUTE_WAREHOUSE = {
  ROOT: '/warehouses',
  EDIT: `/warehouses/${ROUTE_PARAMS.WAREHOUSE_ID}`,
}

export const ROUTE_PRODUCT = {
  ROOT: '/products',
  DETAIL: `/products/detail/${ROUTE_PARAMS.PRODUCT_ID}`,
}

export const ROUTE_USER = {
  ROOT: '/users',
  ADD: '/users/add',
  EDIT: `/users/${ROUTE_PARAMS.USER_ID}`,
}

export const ROUTE_RESOURCE = {
  ROOT: `/users/${ROUTE_PARAMS.USER_ID}/resources`,
  ADD: `/users/${ROUTE_PARAMS.USER_ID}/resources/add`,
  EDIT: `/users/${ROUTE_PARAMS.USER_ID}/resources/${ROUTE_PARAMS.RESOURCE_ID}`,
}

export const ROUTE_AGGREGATOR = {
  ROOT: '/aggregators',
  ADD: '/aggregators/add',
  EDIT: `/aggregators/${ROUTE_PARAMS.AGGREGATOR_ID}`,
}

export const ROUTE_MARKETPLACE = {
  ROOT: '/marketplaces',
  ADD: '/marketplaces/add',
  EDIT: `/marketplaces/${ROUTE_PARAMS.MARKETPLACE_ID}`,
}

export const ROUTE_RELATIONSHIP_AM = {
  ROOT: '/relationshipAMs',
  ADD: '/relationshipAMs/add',
}

export const ROUTE_MARKETPLACE_RELATIONSHIP = {
  ROOT: '/marketplace-relationships',
  ADD: '/marketplace-relationships/add',
  EDIT: `/marketplace-relationships/${ROUTE_PARAMS.MARKETPLACE_RELATIONSHIP_ID}`,
}

export const ROUTE_ASSIGNED_PRODUCTS_TO_MARKETPLACES = {
  ROOT: '/assigned-products',
}

export const ROUTE_ORDER = {
  ROOT: '/orders',
  DETAIL: `/orders/detail/${ROUTE_PARAMS.ORDER_ID}`,
}

export const ROUTE_LISTING_STATUS = {
  ROOT: '/listing-status',
}

export const ROUTE_PRODUCT_PROPERTIES = {
  ROOT: '/product-properties',
  ADD: '/product-properties/add',
  EDIT: `/product-properties/edit/${ROUTE_PARAMS.PRODUCT_PROPERTY_ID}`,
}

export const ROUTE_DEFAULT_PROPERTY_VALUE = {
  ROOT: '/default-property-value',
  ADD: '/default-property-value/add',
  EDIT: `/default-property-value/${ROUTE_PARAMS.DEFAULT_PROPERTY_VALUE_ID}`,
}

export const ROUTE_PRODUCT_CATEGORY_MAPPINGS = {
  ROOT: '/product-category-mappings',
  ADD: '/product-category-mappings/add',
  EDIT: `/product-category-mappings/${ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID}`,
}

export const ROUTE_PRODUCT_PROPERTY_MAPPINGS = {
  ROOT: `/product-property-mappings/${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}`,
  ROOT_NO_PARAMS: '/product-property-mappings',
  ADD: `/product-property-mappings/${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/add`,
  EDIT: `/product-property-mappings/${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/${ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID}`,
  VALUE_MAPPING: `/product-property-mappings/${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/${ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID}/value-mappings`,
}

export const ROUTE_COURIER_MAPPINGS = {
  ROOT: '/courier-mappings',
  ADD: '/courier-mappings/add',
  EDIT: `/courier-mappings/${ROUTE_PARAMS.COURIER_MAPPING_ID}`,
}

export const ROUTE_IMPORT_PRODUCT_PROPERTIES = {
  ROOT: '/import-product-properties',
  RESULT: '/import-product-properties/result',
}

export const ROUTE_DELIVERY_TYPE_MAPPINGS = {
  ROOT: '/delivery-type-mappings',
  ADD: '/delivery-type-mappings/add',
  EDIT: `/delivery-type-mappings/${ROUTE_PARAMS.DELIVERY_TYPE_MAPPING_ID}`,
}

export const ROUTE_PERMISSION_DENIED = {
  ROOT: '/permission-denied',
}

export const ROUTE_UPS = {
  APPLICATION_SETUP: {
    APPLICATION: 'ups/applications',
    MODULES: 'ups/modules',
    ROLES: 'ups/roles',
    PERMISSIONS: 'ups/permissions',
  },
  ORGANIZATION_SETUP: {
    ORGANIZATIONS: 'ups/organizations',
    SITES: 'ups/sites',
    LOCALES: 'ups/locales',
  },
  USER_MANAGEMENT: {
    USERS: 'ups/users',
    USER_PERMISSIONS: 'ups/user-permissions',
    ROLES_TO_ASSIGN: 'ups/roles-to-assign',
  }
}
