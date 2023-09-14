import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import Router, {MemoryRouter} from 'react-router-dom'
import OrganizationsServices from '../../services/OrganizationService'
import {Organizations} from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('Organizations Page', () => {
  it('should match snapshot', async () => {
    const mockDatas = {
      data: [
        {
          id: '1',
          erpId: '1',
          createdAt: '',
          modifiedAt: '',
          name: 'org_1',
          version: 0,
          status: 'Inactive',
        },
        {
          id: '2',
          erpId: '2',
          createdAt: '',
          modifiedAt: '',
          name: 'org_2',
          version: 0,
          status: 'Active',
        },
      ],
    }

    jest.spyOn(Router, 'useParams').mockReturnValue({orgId: '1234'})

    jest
      .spyOn(new OrganizationsServices(axios) as any, 'getAllOrganizations')
      .mockImplementation(() => Promise.resolve(mockDatas))

    const OrganizationsTree = render(
      <MemoryRouter>
        <Organizations />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(OrganizationsTree).toMatchSnapshot()
    })
  })
})
