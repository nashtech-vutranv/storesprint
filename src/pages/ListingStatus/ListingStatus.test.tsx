import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockListingStatuses} from '../../utils/factory'
import {ListingStatus} from '.'

const API = require('../../services/ListingStateService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getListingState: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: {
          content: mockListingStatuses(),
        },
      })
    ),
  })
  return instance
})

test('renders Listing Status Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ListingStatus />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  await waitFor(() =>
    expect(
      tree.queryByText(/listing_status_filter_title_organization_label/i)
    ).toBeInTheDocument()
  )

  await waitFor(() => {
    expect(
      tree.queryByText(/listing_status_filter_title_organization_placeHolder/i)
    ).toBeInTheDocument()
  })
})
