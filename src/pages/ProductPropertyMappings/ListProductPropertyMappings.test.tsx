import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockListProductPropertyMappings, mockOption} from '../../utils/factory'
import {ListProductPropertyMappings} from './'

const API = require('../../services/ProductPropertyMappingsService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    filterProductPropertyMappings: jest
      .fn()
      .mockImplementation(() => Promise.resolve({
        data: mockListProductPropertyMappings()
      })),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    productCategoryMappingsId: 'productCategoryMappingsId',
    marketplaceTypeId: 'marketplaceTypeId',
    mappingTargetId:'mappingTargetId'
}),
}))

beforeEach(() => {
  window.history.pushState({
    selectedMarketplaceType: mockOption(),
    selectedMarketplaceProductCategory: mockOption(),
    eventKey: '0',
    currentStatus: null
  }, '', '')
})

test('renders List product property mappings Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ListProductPropertyMappings />
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
      tree.queryByText(/product_property_mappings_filter_marketplace_type_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(
        /product_property_mappings_filter_marketplace_type_placeHolder/i
      )
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/product_property_mappings_filter_marketplace_product_category_label/i)
    ).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(
      tree.queryByText(
        /product_property_mappings_filter_marketplace_product_category_placeHolder/i
      )
    ).toBeInTheDocument()
  })
})
