import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockOption, mockOrders} from '../../utils/factory'
import {Orders} from '.'

const API = require('../../services/OrderService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getOrders: jest
      .fn()
      .mockImplementation(() => Promise.resolve({
        data: {
            content: mockOrders(),
            totalElements: 2
        }
      })),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({id: 'test_id'}),
}))

beforeEach(() => {
  window.history.pushState({
    selectedOrganizations: [mockOption()],
    selectedSites: [mockOption()],
    selectedLocales: [mockOption()],
    selectedMarketplaces: [mockOption()],
    selectedStatuses: [mockOption()],
    eventKey: '0',
    currentStatus: null
  }, '', '')
})

test('renders Orders Page', async () => {
  const tree = render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
  const refresh = tree.container.querySelector(
    '.p-button-icon.pi-refresh'
  ) as Element
  expect(refresh).toBeTruthy()
  fireEvent.click(refresh)

  await waitFor(() =>
    expect(
      tree.queryByText(/order_filter_organization_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/order_filter_organization_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/order_filter_site_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/order_filter_site_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/order_filter_locale_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/order_filter_locale_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/order_filter_marketplace_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/order_filter_marketplace_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/order_filter_status_label/i)
    ).toBeInTheDocument()
  )
  
  await waitFor(() => {
    expect(
      tree.queryByText(/order_filter_status_placeHolder/i)
    ).toBeInTheDocument()
  })
})
