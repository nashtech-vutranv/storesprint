import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockUpdateProductPropertyMapping,
  mockProductProperties,
} from '../../utils/factory'
import {AddProductPropertyMapping} from '.'

const productPropertyAPI = require('../../services/ProductPropertiesService')
const productPropertyMappingAPI = require('../../services/ProductPropertyMappingsService')

jest.mock(productPropertyAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getProductProperties: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockProductProperties(),
      })
    ),
  })
  return instance
})

jest.mock(productPropertyMappingAPI, () => {
  const instance = jest.fn().mockReturnValue({
    addProductPropertyMapping: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockUpdateProductPropertyMapping(),
      })
    ),
  })
  return instance
})

test('renders Add Product Property Mapping Page', async () => {
  const tree = render(
    <MemoryRouter>
      <AddProductPropertyMapping />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })

  await waitFor(() => {
    expect(
      tree.queryByText(/product_property_mappings_add_page_title/i)
    ).toBeInTheDocument()
  })
})
