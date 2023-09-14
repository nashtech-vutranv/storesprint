import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockCouriers, mockOption} from '../../utils/factory'
import {ListCourierMappings} from './'

const API = require('../../services/CourierMappingsService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    filterCourierMappings: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: {
          content: mockCouriers(),
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

test('renders List courier mappings Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ListCourierMappings />
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
      tree.queryByText(/courier_mappings_filter_title/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/courier_mappings_filter_marketplace_type_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/courier_mappings_filter_marketplace_type_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(tree.queryByText(/common_button_reset_label/i)).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(tree.queryByText(/common_button_apply_label/i)).toBeInTheDocument()
  })
})
