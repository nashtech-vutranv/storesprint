import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockOption, mockDefaultPropertyValues} from '../../utils/factory'
import {DefaultPropertyValues} from '.'

const API = require('../../services/DefaultPropertyValueService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    fetchAllDefaultPropertyValues: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDefaultPropertyValues)),
  })
  return instance
})

beforeEach(() => {
  window.history.pushState(
    {
      keepFilter: true,
      selectedOrganizations: [mockOption()],
      selectedProperties: [mockOption()],
      selectedLocales: [mockOption()],
    },
    '',
    ''
  )
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({id: 'test_id'}),
}))

test('renders Default Property Values Page', async () => {
  const tree = render(
    <MemoryRouter>
      <DefaultPropertyValues />
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
  expect(tree.queryByText(/default_property_value_title/i)).toBeInTheDocument()

  await waitFor(() =>
    expect(
      tree.queryByText(/default_property_value_filter_organization_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(
        /default_property_values_filter_organization_placeHolder/i
      )
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/default_property_value_filter_property_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/default_property_value_filter_property_placeHolder/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/default_property_value_filter_locale_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/default_property_value_filter_locale_placeHolder/i)
    ).toBeInTheDocument()
  })
})
