import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockListProductCategoryMappings, mockOption} from '../../utils/factory'
import {ListProductCategoryMappings} from './'

const API = require('../../services/ProductCategoryMappingsService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    filterProductCategoryMappings: jest
      .fn()
      .mockImplementation(() => Promise.resolve({
        data: {
            content: mockListProductCategoryMappings(),
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
    selectedMmsProductCategory: mockOption(),
    selectedMarketplaceType: mockOption(),
    eventKey: '0',
    currentStatus: null
  }, '', '')
})

test('renders List product category mappings Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ListProductCategoryMappings />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  const refresh = tree.container.querySelector(
    '.p-button-icon.pi-refresh'
  ) as Element
  await waitFor(() => {
    expect(refresh).toBeTruthy()
  })
  
  fireEvent.click(refresh)
  await waitFor(() =>
    expect(
      tree.queryByText(/product_category_mappings_filter_mms_product_category_label/i)
    ).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(
      tree.queryByText(
        /product_category_mappings_filter_mms_product_category_placeHolder/i
      )
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/product_category_mappings_filter_marketplace_type_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(
        /product_category_mappings_filter_marketplace_type_placeHolder/i
      )
    ).toBeInTheDocument()
  })
})
