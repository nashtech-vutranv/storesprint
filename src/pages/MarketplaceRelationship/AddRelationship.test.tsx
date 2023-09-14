import {render, fireEvent, waitFor} from '@testing-library/react'
import axios from 'axios'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOption} from '../../utils/factory'
import MarketplaceRelationshipService from '../../services/MarketplaceRelationshipService'
import {conditionPromise} from '../../utils/'
import OrganizationService from '../../services/OrganizationService'
import SiteServices from '../../services/SitesService'
import SiteLocaleService from '../../services/SiteLocaleService'
import WarehouseServices from '../../services/WarehouseService'
import MarketplaceService from '../../services/MarketplaceService'
import {UpdateRelationships} from '.'

const tree = render(
    <MemoryRouter>
      <UpdateRelationships />
    </MemoryRouter>
  )

describe('Add Marketplace Relationship Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => {
      return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({marketplaceRelationshipsId: undefined}),
      }
    })

    window.history.pushState({
      selectedOrganizations: [mockOption()],
      selectedSites: [mockOption()],
      selectedLocales: [mockOption()]
    }, '', '')
  })

  it('should match snapshot with data from api', async () => {
    jest
      .spyOn(new OrganizationService(axios) as any, 'getAllOrganizations')
      .mockImplementation((organizationsData) => {
        conditionPromise(organizationsData, 'organization')
      })

    jest
      .spyOn(new SiteServices(axios) as any, 'getSitesFromMultiOrganizations')
      .mockImplementation((sitesData) => {
        conditionPromise(sitesData, 'site')
      })

    jest
      .spyOn(new SiteLocaleService(axios) as any, 'getLocalesFromMultiSites')
      .mockImplementation((siteLocalesData) => {
        conditionPromise(siteLocalesData, 'siteLocale')
      })

    jest
      .spyOn(new MarketplaceService(axios) as any, 'getUnAssignedMarketplaces')
      .mockImplementation((marketplacesData) => {
        conditionPromise(marketplacesData, 'marketplace')
      })
    
    jest
      .spyOn(new WarehouseServices(axios) as any, 'getWarehouseByFilter')
      .mockImplementation((warehousesData) => {
        conditionPromise(warehousesData, 'warehouse')
      })

    jest
      .spyOn(
        new MarketplaceRelationshipService(axios) as any,
        'addMarketplaceRelationship'
      )
      .mockImplementation((marketplacesData) => {
        conditionPromise(marketplacesData, 'marketplaceRelationship')
      })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  
    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)

    const organizationSelect = tree.container.querySelector(
      '#organizationId'
    ) as Element
    await waitFor(() => expect(organizationSelect).toHaveClass('inherit-color'))

    const siteSelect = tree.container.querySelector(
      '#siteId'
    ) as Element
    await waitFor(() => expect(siteSelect).toHaveClass('inherit-color'))

    const marketplaceSelect = tree.container.querySelector(
      '#marketplaceId'
    ) as Element
    await waitFor(() => expect(marketplaceSelect).toHaveClass('inherit-color'))

    const localeSelect = tree.container.querySelector(
      '#siteLocaleId'
    ) as Element
    await waitFor(() => expect(localeSelect).toHaveClass('inherit-color'))

    const stockMinimumLevelInput = tree.container.querySelector(
      '#stockMinimumLevel'
    ) as Element
    await waitFor(() => expect(stockMinimumLevelInput).toHaveClass('w-full'))

    const sellingPriceAdjustmentInput = tree.container.querySelector(
      '#sellingPriceAdjustment'
    ) as Element
    await waitFor(() =>
      expect(sellingPriceAdjustmentInput).toHaveClass('w-full')
    )

    const reviewProductSwitchInput = tree.container.querySelectorAll(
      '.p-inputswitch'
    )[0] as Element
    fireEvent.click(reviewProductSwitchInput)
    await waitFor(() =>
      expect(reviewProductSwitchInput).not.toHaveClass('p-inputswitch-checked')
    )
    fireEvent.click(reviewProductSwitchInput)
    await waitFor(() =>
      expect(reviewProductSwitchInput).toHaveClass('p-inputswitch-checked')
    )

    const activeSwitchInput = tree.container.querySelectorAll(
      '.p-inputswitch'
    )[1] as Element
    fireEvent.click(activeSwitchInput)
    await waitFor(() =>
      expect(activeSwitchInput).not.toHaveClass('p-inputswitch-checked')
    )
    fireEvent.click(activeSwitchInput)
    await waitFor(() =>
      expect(activeSwitchInput).toHaveClass('p-inputswitch-checked')
    )
  })
})
