import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockOption, mockProducts} from '../../utils/factory'
import {Products} from '.'

const API = require('../../services/ProductService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getProductsByFilter: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockProducts)),
  })
  return instance
})

beforeEach(() => {
  window.history.pushState({
    selectedOrganizations: [mockOption()],
    selectedSites: [mockOption()],
    selectedLocales: [mockOption()],
    currentStatus: null,
    eventKey: '0'
  }, '', '')})


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({id: 'test_id'}),
}))

test('renders Product Page', async () => {
  const tree = render(
    <MemoryRouter>
      <Products />
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
