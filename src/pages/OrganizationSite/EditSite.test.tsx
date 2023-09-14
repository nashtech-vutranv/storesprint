import {render, waitFor, fireEvent} from '@testing-library/react'
import Router, {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {UpdateOrganizationSite} from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest
  .spyOn(Router, 'useParams')
  .mockReturnValue({siteId: 'site-id', orgId: 'org-id'})

const siteReturn = Promise.resolve({
  data: {
    id: 'site-id',
    erpId: 'erp-id',
    name: 'site-name',
    organizationId: '',
    url: 'site-url',
    status: 'ACTIVE',
    version: 0,
    createdAt: '',
    modifiedAt: '',
  },
})

jest.mock('../../services/SitesService', () => {
  const instance = jest.fn().mockReturnValue({
    getSiteById: jest.fn().mockImplementation(() => siteReturn),
  })
  return instance
})

test('renders Edit OrganizationSite', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateOrganizationSite />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  await waitFor(() =>
    expect(tree.getByDisplayValue(/site-name/i)).toBeInTheDocument()
  )
  
  fireEvent.click(tree.getByText(/common_confirm_save/i))
})
