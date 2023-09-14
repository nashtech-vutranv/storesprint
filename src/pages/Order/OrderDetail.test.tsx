import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockOption, mockOrderDetail, mockOrderLines} from '../../utils/factory'
import {OrderDetail} from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({orderId: 'test_id'}),
}))

const tree = render(
  <MemoryRouter>
    <OrderDetail />
  </MemoryRouter>
)

beforeEach(() => {
  window.history.pushState({
    selectedOrganizations: [mockOption()],
    selectedSites: [mockOption()],
    selectedLocales: [mockOption()],
    selectedMarketplaces: [mockOption()],
    selectedStatuses: [mockOption()],
    currentStatus: null,
    eventKey: '0'
  }, '', '')
})

test('should match snapshot with successfully data from api', async () => {
  jest.mock('../../services/OrderService', () => {
    const instance = jest.fn().mockReturnValue({
      getOrderById: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockOrderDetail)),
      getOrderlines: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockOrderLines)),
    })
    return instance
  })
  
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
    expect(tree.queryByText(/order_detail_title/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_id/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_erpId/i)).toBeInTheDocument()
    expect(
      tree.queryByText(/order_detail_marketplace_order_number/i)
    ).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_country_code/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_currency/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_delivery_type/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_delivery_cost/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_order_status/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_tab_orderlines/i)).toBeInTheDocument()
    expect(tree.queryByText(/order_detail_tab_shipments/i)).toBeInTheDocument()
  })

  const idInput = tree.container.querySelector('input[name="id"]') as Element
  await waitFor(() => {
    expect(idInput).toHaveAttribute('disabled')
  })
  
  const erpIdInput = tree.container.querySelector(
    'input[name="erpId"]'
  ) as Element
  await waitFor(() => {
    expect(erpIdInput).toHaveAttribute('disabled')
  })

  const marketplaceOrderNumberInput = tree.container.querySelector(
    'input[name="marketplaceOrderNumber"]'
  ) as Element
  await waitFor(() => {
    expect(marketplaceOrderNumberInput).toHaveAttribute('disabled')
  })
  
  const countryCodeInput = tree.container.querySelector(
    'input[name="countryCode"]'
  ) as Element
  await waitFor(() => {
    expect(countryCodeInput).toHaveAttribute('disabled')
  })
  
  const currency = tree.container.querySelector(
    'input[name="currency"]'
  ) as Element
  await waitFor(() => {
    expect(currency).toHaveAttribute('disabled')
  })
  
  const deliveryType = tree.container.querySelector(
    'input[name="deliveryType"]'
  ) as Element
  await waitFor(() => {
    expect(deliveryType).toHaveAttribute('disabled')
  })
  
  const shippingCost = tree.container.querySelector(
    'input[name="shippingCost"]'
  ) as Element
  await waitFor(() => {
    expect(shippingCost).toHaveAttribute('disabled')
  })
  
  const orderStatus = tree.container.querySelector(
    'input[name="orderStatus"]'
  ) as Element
  await waitFor(() => {
    expect(orderStatus).toHaveAttribute('disabled')
  })
})

test('should match snapshot with error from API', async () => {
  jest.mock('../../services/OrderService', () => {
    const mockValue = jest.fn().mockReturnValue({
      getOrderById: jest.fn().mockImplementation(() => Promise.reject()),
      getOrderlines: jest.fn().mockImplementation(() => Promise.reject()),
    })

    return mockValue
  })

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
