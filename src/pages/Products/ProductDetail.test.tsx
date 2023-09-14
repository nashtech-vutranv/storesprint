import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockProductDetail, mockPropertyGeneric, mockOption} from '../../utils/factory'
import ProductDetail from './ProductDetail'

beforeEach(() => {
  window.history.pushState({
    selectedOrganizations: [mockOption()],
    selectedSites: [mockOption()],
    selectedLocales: [mockOption()],
    currentStatus: null,
    eventKey: '0'
  }, '', '')})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({productId: 'test_id'}),
}))

test('should match snapshot with successfully data from api', async () => {
  jest.mock('../../services/ProductService', () => {
    const instance = jest.fn().mockReturnValue({
      getProductById: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockProductDetail())),
    })
    return instance
  })

  jest.mock('../../services/ProductService', () => {
    const instance = jest.fn().mockReturnValue({
      getGenericProperties: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockPropertyGeneric().property)),
    })
    return instance
  })

  const tree = render(
    <MemoryRouter>
      <ProductDetail />
    </MemoryRouter>
  )


  await waitFor(() => {
    expect(tree).toMatchSnapshot()
    expect(
      tree.queryByText(/product_detail_organizationErpId/i)
    ).toBeInTheDocument()
    expect(
      tree.queryByText(/product_detail_organizationName/i)
    ).toBeInTheDocument()
    expect(tree.queryByText(/product_detail_productId/i)).toBeInTheDocument()
    expect(tree.queryByText(/product_detail_productName/i)).toBeInTheDocument()
    expect(tree.queryByText(/product_detail_productErpId/i)).toBeInTheDocument()
    expect(
      tree.queryByText(/product_detail_tab_stockLevel/i)
    ).toBeInTheDocument()
    expect(tree.queryByText(/product_detail_tab_price/i)).toBeInTheDocument()
  })
  
  const organizationErpIdInput = tree.container.querySelector(
    'input[name="organizationErpId"]'
  ) as Element
  await waitFor(() => {
    expect(organizationErpIdInput).toHaveAttribute('disabled')
  })
  
  const organizationNameInput = tree.container.querySelector(
    'input[name="organizationName"]'
  ) as Element
  await waitFor(() => {
    expect(organizationNameInput).toHaveAttribute('disabled')
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
})
