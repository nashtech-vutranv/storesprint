import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockUpdateProductPropertyMapping,
  mockProductProperties,
  mockProductPropertyMappings,
} from '../../utils/factory'
import {EditProductPropertyMapping} from '.'

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
    getProductPropertyAttribute: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockProductPropertyMappings(),
      })
    ),
  })
  return instance
})

jest.mock(productPropertyMappingAPI, () => {
  const instance = jest.fn().mockReturnValue({
    editProductPropertyMapping: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockUpdateProductPropertyMapping(),
      })
    ),
  })
  return instance
})

test('renders Edit Product Property Mapping Page', async () => {
  const tree = render(
    <MemoryRouter>
      <EditProductPropertyMapping />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })

  await waitFor(() => {
    expect(
      tree.queryByText(/product_property_mappings_edit_page_title/i)
    ).toBeInTheDocument()
  })
})
