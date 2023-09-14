import {IPagination} from '../interface'

export const defaultTablePaginationSortByErpIdPerPage: IPagination = {
  first: 0,
  rows: 10,
  page: 1,
  sortField: 'erpId',
  sortOrder: 1,
  keyword: '',
}

export const defaultAllDatasByErpIdPagination: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  rows: 200000
}

export const defaultOrganizationsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage
}

export const defaultAggregatorsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'name'
}

export const defaultMarketplacesTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'name'
}

export const defaultRelationshipAMsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'aggregator.name'
}

export const defaultAssignedResourceTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'organizationResponse.name',
}

export const defaultRelationshipTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'organization.name'
}

export const defaultUsersTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'fullName'
}

export const defaulStockLevelTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'organizationWarehouse.name'
}

export const defaulProductPriceTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'siteLocale.site.name'
}

export const defaulMarketplaceTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'localeMarketplace.marketplace.name',
}

export const defaulOrderShipmentTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'shipment.shipmentNumber'
}

export const defaultListingStateTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'marketplaceProduct.product.erpId'
}

export const defaultMappingsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  rows: 3000,
  sortField: 'mappingType.name',
}

export const defaultPropertyValuesTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'organizationName',
}

export const productCategoryMappingsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'mmsValue',
}

export const productPropertyMappingsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'attributeResponse.value',
}

export const productPropertyValueMappingTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'mappingTarget.marketplaceValue',
}

export const courierMappingsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'mmsValue',
}

export const returnsRefundsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'modifiedAt',
}

export const deliveryTypeMappingsTablePaginationPerPage: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
  sortField: 'mmsValue',
}
