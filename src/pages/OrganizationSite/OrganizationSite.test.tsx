import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {OrganizationSite} from '.'

const sitesReturn = Promise.resolve({
  data: {
    content: [
      {
        id: '750615360979664898',
        createdAt: '2022-04-05T06:27:07.673767Z',
        modifiedAt: '2022-04-08T08:26:25.309229Z',
        version: 5,
        erpId: '102',
        organizationId: '750615355451244546',
        name: 'Ritchie-Kovacekk',
        url: 'http://www.lockmankilbacnn.io',
        status: 'ACTIVE',
      },
    ],
    totalElements: 10,
  },
})

jest.mock('../../services/SitesService', () => {
  const instance = jest.fn().mockReturnValue({
    getSitesByOrganization: jest.fn().mockImplementation(() => sitesReturn),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({orgId: 'org-id'}),
}))

test('renders OrganizationSite', async () => {
  const tree = render(
    <MemoryRouter>
      <OrganizationSite />
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
    expect(tree.queryByText(/Ritchie-Kovacekk/i)).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(
      tree.queryByText(/http:\/\/www.lockmankilbacnn.io/i)
    ).toBeInTheDocument()
  })
})
