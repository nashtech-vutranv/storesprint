import {AxiosInstance} from 'axios'
import {ISitesFilter, ISiteLocalesFilter} from '../interface/filters'
import {IPagination} from '../interface/pagination'
import {IBodyRequestAssignedProducts} from '../interface/assignedProduct'
import {IBodyMarketplace} from '../interface/marketplace'
import {IAssignMarketplace} from '../interface/assignMarketplace'
import {IBodyRequestAssignProductsMarketplaces} from '../interface/productMaketplace'
import {generateFilterAssignMarketplacesQuery} from '../helpers/queryParams'
import OrganizationService from './OrganizationService'
import SiteServices from './SitesService'
import SiteLocaleService from './SiteLocaleService'
import MarketplaceService from './MarketplaceService'
import MarketplaceInventoryService from './MarketplaceMPService'

class AssignedProductService {
  private axiosClient

  constructor(axiosClient: AxiosInstance) {
    axiosClient.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
    this.axiosClient = axiosClient
  }

  getOrganizationsWithReviewProductsBeforeListingProp(
    organizationsPaginationQuery: Omit<IPagination, 'keyword'>
  ) {
    return new OrganizationService(this.axiosClient).getAllOrganizationsByKeyword(
      organizationsPaginationQuery
    )
  }

  getSitesBySelectedReviewProductsBeforeListingOrganizations(
    sitesFilter: ISitesFilter,
    sitesPaginationQuery: Omit<IPagination, 'keyword'>
  ) {
    return new SiteServices(this.axiosClient).getSitesFromMultiOrganizations(
      sitesFilter,
      sitesPaginationQuery
    )
  }

  getSiteLocalesBySelectedReviewProductsBeforeListingSites(
    siteLocalesFilter: ISiteLocalesFilter,
    siteLocalesPaginationQuery: Omit<IPagination, 'keyword'>
  ) {
    return new SiteLocaleService(this.axiosClient).getLocalesFromMultiSites(
      siteLocalesFilter,
      siteLocalesPaginationQuery
    )
  }

  getAssignedMarketplaces(paginationQueryParam: any, entity: IBodyMarketplace) {
    return new MarketplaceService(this.axiosClient).getMarketplacesWithIsProductReviewProp(paginationQueryParam, entity)
  }

  getProductsByFilterInMarketplaceRelationship(
    paginationQuery: Omit<IPagination, 'keyword'>,
    body: IBodyRequestAssignedProducts | {}
  ) {
    
    return new MarketplaceInventoryService(this.axiosClient).getProductsMarketplaceByFilter(
      paginationQuery,
      body
    )
  }

  getDialogMarketplaces(assignMarketplacesObj: IAssignMarketplace) {
    return this.axiosClient.get(
      `/products/assigned-marketplaces/marketplaces?${generateFilterAssignMarketplacesQuery(assignMarketplacesObj)}`
    )
  }

  asignProductsToMarketplaces(productMarketplaces: IBodyRequestAssignProductsMarketplaces) {
    return this.axiosClient.post(
      '/products/assigned-marketplaces/products-marketplaces',
      productMarketplaces
    )
  }
}

export default AssignedProductService
