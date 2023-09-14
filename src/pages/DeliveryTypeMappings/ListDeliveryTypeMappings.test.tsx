import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockDeliveryTypeMapping, mockOption} from '../../utils/factory'
import {ListDeliveryTypeMappings} from './'

const API = require('../../services/DeliveryService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    filterDeliveryTypeMappings: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: {
          content: mockDeliveryTypeMapping(),
          totalElements: 2,
        },
      })
    ),
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
      selectedMarketplaceType: mockOption(),
      eventKey: '0',
      currentStatus: null,
    },
    '',
    ''
  )
})

test('renders List delivery type mappings Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ListDeliveryTypeMappings />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  const refresh = tree.container.querySelector(
    '.p-button-icon.pi-refresh'
  ) as Element
  expect(refresh).toBeTruthy()
  fireEvent.click(refresh)

  await waitFor(() => {
    expect(
      tree.queryByText(/delivery_type_mappings_filter_title/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/delivery_type_mappings_filter_marketplace_type_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/delivery_type_mappings_filter_marketplace_type_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(tree.queryByText(/common_button_reset_label/i)).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(tree.queryByText(/common_button_apply_label/i)).toBeInTheDocument()
  })
})
