import {render, waitFor} from '@testing-library/react'
import axios from 'axios'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import UserService from '../../../services/UserService'
import {mockOption} from '../../../utils/factory'
import {UpdateUser} from '../'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({userId: '1234'})),
}))

beforeEach(() => {
  window.history.pushState(
    {
      selectedOrganization: mockOption(),
      selectedSites: [mockOption()],
    },
    '',
    ''
  )
})

const mockData = {
  id: '',
  erpId: '',
  name: '',
  firstName: 'Matthew',
  lastName: 'Moulding',
  emailAddress: 'matthewmoulding@thg.com',
  createdAt: '',
  modifiedAt: '',
  version: 0,
  status: 'ACTIVE',
}

const tree = render(
    <MemoryRouter>
      <UpdateUser />
    </MemoryRouter>
  )

describe('Update User Page', () => {
  it('should match snapshot without data', async () => {
    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })

  it('should match snapshot with data', async () => {
    jest
      .spyOn(new UserService(axios) as any, 'getUserById')
      .mockImplementation((id) => Promise.resolve(mockData))
    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
    
  })
})
