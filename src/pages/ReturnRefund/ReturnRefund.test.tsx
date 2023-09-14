import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockReturnsRefunds,
  mockOrderReturnStatus,
  mockOrganizations,
  mockSites,
  mockSiteLocales,
  mockReturnRefundAssignedMarketplaces,
} from '../../utils/factory'
import ReturnRefund from './ReturnRefund'

const orderAPI = require('../../services/OrderService')
const organizationAPI = require('../../services/OrganizationService')
const siteApi = require('../../services/SitesService')
const siteLocaleApi = require('../../services/SiteLocaleService')
const assignProductApi = require('../../services/AssignedProductService')

jest.mock(orderAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getReturnsRefunds: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockReturnsRefunds(),
      })
    ),
  })
  return instance
})

jest.mock(orderAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getOrderReturnStatuses: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockOrderReturnStatus(),
      })
    ),
  })
  return instance
})

jest.mock(organizationAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getAllOrganizations: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockOrganizations(),
      })
    ),
  })
  return instance
})

jest.mock(siteApi, () => {
  const instance = jest.fn().mockReturnValue({
    getSitesFromMultiOrganizations: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockSites(),
      })
    ),
  })
  return instance
})

jest.mock(siteLocaleApi, () => {
  const instance = jest.fn().mockReturnValue({
    getLocalesFromMultiSites: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockSiteLocales(),
      })
    ),
  })
  return instance
})

jest.mock(assignProductApi, () => {
  const instance = jest.fn().mockReturnValue({
    getAssignedMarketplaces: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockReturnRefundAssignedMarketplaces(),
      })
    ),
  })
  return instance
})

test('renders Returns Refunds Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ReturnRefund />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
    expect(tree.queryByText(/returns_refunds_page_title/i)).toBeInTheDocument()
  })
})
