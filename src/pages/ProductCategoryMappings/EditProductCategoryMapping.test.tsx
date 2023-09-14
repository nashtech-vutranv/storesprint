import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockGetMappingTargetInProductCategory,
  mockGetProductCategory,
  mockGetProductCategoryMapping
} from '../../utils/factory'
import {EditProductCategoryMapping} from '.'

const mappingAPI = require('../../services/MappingService')
const productCategoryAPI = require('../../services/ProductCategoryMappingsService')

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
    getProductCategoryMapping: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockGetProductCategoryMapping(),
      })
    ),
  })
  return instance
})

jest.mock(productCategoryAPI, () => {
  const instance = jest.fn().mockReturnValue({
    editProductCategoriesMapping: jest.fn().mockImplementation((requestData) =>
      Promise.resolve()
    ),
  })
  return instance
})

test('renders Edit Product Categories Mapping Page', async () => {
  const tree = render(
    <MemoryRouter>
      <EditProductCategoryMapping />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  

  await waitFor(() => {
    expect(
      tree.queryByText(/product_category_mapping_edit_title/i)
    ).toBeInTheDocument()
  })
})
