import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockGetAllMappingMarketplaces,
  mockGetMappingTargetInProductCategory,
  mockGetProductCategory,
  mockAddProductCategoriesMapping,
  mockSplitValues,
} from '../../utils/factory'
import {AddProductCategoryMapping} from '.'

const mappingAPI = require('../../services/MappingService')
const productCategoryAPI = require('../../services/ProductCategoryMappingsService')

jest.mock(mappingAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getAllMappingMarketplaces: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockGetAllMappingMarketplaces(),
      })
    ),
  })
  return instance
})

jest.mock(mappingAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getMappingTargetInProductCategory: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockGetMappingTargetInProductCategory(),
      })
    ),
  })
  return instance
})

jest.mock(productCategoryAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getProductCategory: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockGetProductCategory(),
      })
    ),
  })
  return instance
})

jest.mock(productCategoryAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getSplitPropertyValues: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockSplitValues(),
      })
    ),
  })
  return instance
})

jest.mock(productCategoryAPI, () => {
  const instance = jest.fn().mockReturnValue({
    addProductCategoriesMapping: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockAddProductCategoriesMapping(),
      })
    ),
  })
  return instance
})

test('renders Add Product Categories Mapping Page', async () => {
  const tree = render(
    <MemoryRouter>
      <AddProductCategoryMapping />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  await waitFor(() => {
    expect(
      tree.queryByText(/product_category_mapping_add_title/i)
    ).toBeInTheDocument()
  })
  
  const checkBox = tree.container.querySelector('#mappingCb') as Element
  await waitFor(() => {
    expect(checkBox).toBeTruthy()
  })
  
  fireEvent.click(checkBox)
})
