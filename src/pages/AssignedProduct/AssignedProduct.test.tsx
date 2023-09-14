import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import axios from 'axios'
import AssignedProductService from '../../services/AssignedProductService'
import MarketplaceInventoryService from '../../services/MarketplaceInventoryService'
import {conditionPromise} from '../../utils'
import {AssignedProduct} from '.'

const tree = render(
  <MemoryRouter>
    <AssignedProduct />
  </MemoryRouter>
)

describe('Assign Products to Marketplaces Page', () => {
  it('should match snapshot', async () => {
    jest
      .spyOn(
        new AssignedProductService(axios) as any,
        'getOrganizationsWithReviewProductsBeforeListingProp'
      )
      .mockImplementation((organizationsFilter, organizationsPaginationQuery) => {
        conditionPromise(organizationsFilter,'organization', organizationsPaginationQuery)
      })

    jest
      .spyOn(
        new AssignedProductService(axios) as any,
        'getSitesBySelectedReviewProductsBeforeListingOrganizations'
      )
      .mockImplementation((sitesFilter, sitesPaginationQuery) => {
        conditionPromise(sitesFilter, 'site', sitesPaginationQuery)
      })

    jest
      .spyOn(new AssignedProductService(axios) as any,
       'getSiteLocalesBySelectedReviewProductsBeforeListingSites'
       )
      .mockImplementation((siteLocalesFilter, siteLocalesPaginationQuery) => {
        conditionPromise(siteLocalesFilter, 'siteLocale', siteLocalesPaginationQuery)
      })

    jest
      .spyOn(new AssignedProductService(axios) as any,
       'getAssignedMarketplaces'
       )
      .mockImplementation((paginationQueryParam, entity) => {
        conditionPromise(paginationQueryParam, 'marketplace', entity)
      })
    
    jest
      .spyOn(new AssignedProductService(axios) as any,
       'getProductsByFilterInMarketplaceRelationship'
       )
      .mockImplementation((paginationQueryParam, body) => {
        conditionPromise(paginationQueryParam, 'assignedProduct', body)
      })

    jest
      .spyOn(new MarketplaceInventoryService(axios) as any,
       'getCalculateAssigneMarketplaces'
       )
      .mockImplementation((body, bodyParam) => {
        conditionPromise(body, 'calculateMarketplace', bodyParam)
      })

    jest
      .spyOn(new MarketplaceInventoryService(axios) as any,
       'assignSelectedProductsToMarketplaces'
       )
      .mockImplementation((body, bodyParam) => {
        conditionPromise(body,'assignedProductResponse', bodyParam)
      })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })

    await waitFor(() => {
      expect(
        tree.getByText(/assigned_products_marketplace_title/i)
      ).toBeInTheDocument()
      expect(
        tree.getByText(/assigned_products_marketplace_fitler_title/i)
      ).toBeInTheDocument()
      expect(
        tree.getByText(
          /assigned_products_marketplace_organization_placeHolder/i
        )
      ).toBeInTheDocument()
    })
  })
})
