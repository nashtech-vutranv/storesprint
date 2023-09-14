import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import ViewAssignedResources from '.'

const resourcesReturn = Promise.resolve({
  data: {
    content: [
      {
        id: '750666488464801794',
        createdAt: null,
        modifiedAt: null,
        version: 0,
        organizationResponse: {
          additionalInformation: 'additional Information change',
          addressLine1: '1',
          addressLine2: null,
          addressLine3: null,
          city: 12,
          contactEmailAddress: '5@nashtechglobal.com',
          contactPhoneNumber: null,
          createdAt: '2022-04-05T06:26:32.910051Z',
          modifiedAt: '2022-04-20T07:28:06.351159Z',
          erpId: '753103736600461315',
          id: '750615242200154115',
          name: '1',
          postCode: '1',
          registrationNumber:
            '10334903-d4f8-4996-acee-835e869a3af31234567888888888999999999101',
          status: 'ACTIVE',
          vatRegistrationNumber: null,
          version: 28,
        },
        siteResponse: {
          createdAt: '2022-04-05T06:26:33.155784Z',
          modifiedAt: '2022-04-05T06:26:33.155784Z',
          erpId: '753102974088216579',
          id: '750615243236409347',
          name: 'Keebler-Dach',
          organizationId: '750617837993918466',
          status: 'ACTIVE',
          url: 'www.stracke-gerlach.biz',
          version: 0,
        },
      },
    ],
    totalElements: 3,
    totalPages: 1,
    size: 10,
    empty: false,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 3,
  },
})

jest.mock('../../../services/ResourceService', () => {
  const instance = jest.fn().mockReturnValue({
    getResoucesByUserId: jest.fn().mockImplementation(() => resourcesReturn),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useParams: () => ({userId: '750615234142633987'}),
}))

test('renders View Assigned Resources Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ViewAssignedResources />
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
    expect(
      tree.queryByText(/resources_column_header_site/i)
    ).toBeInTheDocument()
  })
})
