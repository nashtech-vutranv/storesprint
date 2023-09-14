import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {
  mockEnumValueMappings,
  mockGetMMSProductPropertyValues,
  mockUpdateEnumValueMapping,
} from '../../utils/factory'
import ValueMappings from './ValueMappings'

const mappingServiceAPI = require('../../services/MappingService')

jest.mock(mappingServiceAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getMappingProductEnumValues: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockEnumValueMappings(),
      })
    ),
  })
  return instance
})

jest.mock(mappingServiceAPI, () => {
  const instance = jest.fn().mockReturnValue({
    getMMSProductPropertyValues: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockGetMMSProductPropertyValues(),
      })
    ),
  })
  return instance
})

jest.mock(mappingServiceAPI, () => {
  const instance = jest.fn().mockReturnValue({
    updateEnumValueMapping: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockUpdateEnumValueMapping(),
      })
    ),
  })
  return instance
})

test('renders Add Value Mapping Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ValueMappings />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  await waitFor(() => {
    expect(
      tree.queryByText(/product_property_mappings_page_title/i)
    ).toBeInTheDocument()
  })
})
