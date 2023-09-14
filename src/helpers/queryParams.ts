import _ from 'lodash'
import {IPagination} from '../interface/pagination'
import {IAssignMarketplace} from '../interface/assignMarketplace'

export const generateFilterPaginationQuery = (
  filterPaginationQuery?: Omit<IPagination, 'keyword'>
) => {
  if (filterPaginationQuery) {
    let sorts = ''

    if (!_.isEmpty(filterPaginationQuery.sortField)) {
      filterPaginationQuery.sortField === 'fullName'
        ? (sorts +=
            '&sort=firstName,' +
            (filterPaginationQuery.sortOrder === 1 ? 'asc' : 'desc') +
            '&sort=lastName,asc')
        : (sorts +=
            '&sort=' +
            filterPaginationQuery.sortField +
            ',' +
            (filterPaginationQuery.sortOrder === 1 ? 'asc' : 'desc'))
    }

    return `page=${filterPaginationQuery.page - 1}&size=${
      filterPaginationQuery.rows
    }${sorts}`
  }
  return ''
}

export const buildPaginationQueryOpts = (paginationQuery: any) => {
  if (paginationQuery) {
    let sorts = ''
    let keyword = ''
    let excludeString = 'Response'
    let isReviewProduct = ''

    if (!_.isEmpty(paginationQuery.sortField)) {
      sorts +=
        '&sort=' +
        paginationQuery.sortField.replace(excludeString, '') +
        ',' +
        (paginationQuery.sortOrder === 1 ? 'asc' : 'desc')
    }

    if (!_.isEmpty(paginationQuery.keyword)) {
      keyword += '&search=' + encodeURIComponent(paginationQuery.keyword)
    }

    if (paginationQuery.isReviewProduct) {
      isReviewProduct += '&isReviewProduct=true'
    }

    if (!paginationQuery.isReviewProduct) {
      isReviewProduct += '&isReviewProduct=false'
    }

    return `page=${paginationQuery.page - 1}&size=${
      paginationQuery.rows
    }${isReviewProduct}${keyword}${sorts}`
  }
  return ''
}

export const generateFilterAssignMarketplacesQuery = (
  filterPaginationQuery?: Omit<IPagination, 'keyword'>
) => {
  if (filterPaginationQuery) {
    let sorts = ''

    if (!_.isEmpty(filterPaginationQuery.sortField)) {
      filterPaginationQuery.sortField === 'fullName'
        ? (sorts +=
            '&sort=firstName,' +
            (filterPaginationQuery.sortOrder === 1 ? 'asc' : 'desc') +
            '&sort=lastName,asc')
        : (sorts +=
            '&sort=' +
            filterPaginationQuery.sortField +
            ',' +
            (filterPaginationQuery.sortOrder === 1 ? 'asc' : 'desc'))
    }

    return `page=${filterPaginationQuery.page - 1}&size=${
      filterPaginationQuery.rows
    }${sorts}`
  }
  return ''
}

export const generateFilterAssignMarketplaceQuery = (
  filterAssignMarketplaceQuery: IAssignMarketplace
) => {
  const {
    organizationId,
    siteId,
    siteLocaleId,
    marketplaceIds,
    isAllProducts
  } = filterAssignMarketplaceQuery
    return `organizationId=${organizationId}&siteId=${siteId}&siteLocaleId=${siteLocaleId}&marketplaceIds=${marketplaceIds.toString()}&isAllProducts=${isAllProducts ? 'true' : 'false'}`
  }