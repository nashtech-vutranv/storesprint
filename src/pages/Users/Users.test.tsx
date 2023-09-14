import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockOption} from '../../utils/factory'
import {Users} from '.'

const API = require('../../services/ProductService')

const mockProductData = Promise.resolve({
  data: {
    content: [
      {
        id: '1111',
        createdAt: '',
        modifiedAt: '',
        version: 1,
        erpId: '1',
        name: 'user_test',
        status: 'ACTIVE',
      },
    ],
    totalElements: 10,
  },
})

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getWarehouseByFilter: jest.fn().mockImplementation(() => mockProductData),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({id: 'test_id'}),
}))

beforeEach(() => {
  window.history.pushState(
    {
      keepFilter: true,
      selectedOrganization: mockOption(),
      selectedSites: [mockOption()],
    },
    '',
    ''
  )
})

jest.useRealTimers()

test('renders Users Page', async () => {
  const tree = render(
    <MemoryRouter>
      <Users />
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
      tree.queryByText(/products_filter_organization_label/i)
    ).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(
      tree.queryByText(/products_filter_organization_placeHolder/i)
    ).toBeInTheDocument()
  })
})
