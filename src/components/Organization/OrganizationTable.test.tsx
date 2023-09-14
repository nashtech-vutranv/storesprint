import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import OrganizationTable from './OrganizationTable'

const organizationsReturn = Promise.resolve({
  data: {
    content: [
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
    totalElements: 10,
  },
})

jest.mock('../../services/OrganizationService', () => {
  const instance = jest.fn().mockReturnValue({
    getAllOrganizationsByKeyword: jest
      .fn()
      .mockImplementation(() => organizationsReturn),
  })
  return instance
})

describe('Organizations Table', () => {
  it('should match snapshot', async () => {
    const tree = render(
      <MemoryRouter>
        <OrganizationTable />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
