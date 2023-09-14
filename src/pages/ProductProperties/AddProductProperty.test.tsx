import {render, waitFor, fireEvent} from '@testing-library/react'
import Router, {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {UpdateProductProperty} from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.spyOn(Router, 'useParams').mockReturnValue({
  productPropertyId: undefined,
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
    fetchProductPropertyTypes: jest
      .fn()
      .mockImplementation(() => propertyTypes),
  })
  return instance
})

test('renders Add Product Property', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateProductProperty />
    </MemoryRouter>
  )
  await waitFor(() =>
    expect(tree.getByText(/product_properties_add_title/i)).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  fireEvent.click(tree.getByText(/common_confirm_save/i))
})
