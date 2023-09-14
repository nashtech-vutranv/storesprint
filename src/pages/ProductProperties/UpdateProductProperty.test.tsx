import {render, waitFor, fireEvent} from '@testing-library/react'
import Router, {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {UpdateProductProperty} from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.spyOn(Router, 'useParams').mockReturnValue({
  productPropertyId: '123456789',
})

const productProperty = Promise.resolve({
  id: '769347829487697923',
  createdAt: null,
  modifiedAt: null,
  version: 0,
  erpId: 'variationsku',
  name: 'variationSKU',
  type: 'String',
  localeSensitive: true,
  existedValues: true,
  status: 'ACTIVE',
})

const propertyTypes = Promise.resolve([
  {
    label: 'String',
    value: 'String',
  },
  {
    label: 'Long string',
    value: 'text',
  },
  {
    label: 'Number',
    value: 'float',
  },
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'Boolean',
    value: 'bool',
  },
])

jest.mock('../../services/ProductPropertiesService', () => {
  const instance = jest.fn().mockReturnValue({
    fetchProductPropertiesById: jest
      .fn()
      .mockImplementation(() => productProperty),
    fetchProductPropertyTypes: jest
      .fn()
      .mockImplementation(() => propertyTypes),
    editProductProperty: jest.fn().mockImplementation(() => productProperty),
  })
  return instance
})

test('renders Update Product Property', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateProductProperty />
    </MemoryRouter>
  )
  await waitFor(() =>
    expect(tree.getByText(/product_properties_edit_title/i)).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  fireEvent.click(tree.getByText(/common_confirm_save/i))
})
