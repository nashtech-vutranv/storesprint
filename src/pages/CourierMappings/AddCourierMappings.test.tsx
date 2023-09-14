import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import axios from 'axios'
import {
  mockCourierMappings,
  mockMarketplaceCouriers,
  mockMarketplaceTypes,
} from '../../utils/factory'
import CourierServices from '../../services/CourierService'
import MappingService from '../../services/MappingService'
import UpdateCourierMappings from './UpdateCourierMappings'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({courierMappingId: 'test-courier-mapping-id'}),
}))

describe('Add Courier Mapping Page', () => {
  it('should match snapshot', async () => {
    jest
      .spyOn(new CourierServices(axios) as any, 'getAllCouriers')
      .mockImplementation((userId) => {
        if (userId !== 'existed_user') {
          return Promise.resolve(mockCourierMappings())
        } else return Promise.reject()
      })

    jest
      .spyOn(new CourierServices(axios) as any, 'getMarketplaceCourier')
      .mockImplementation((marketplaceCourierId) => {
        if (marketplaceCourierId) {
          return Promise.resolve(mockMarketplaceCouriers())
        } else return Promise.reject()
      })

    jest
      .spyOn(new MappingService(axios) as any, 'getAllMappingMarketplaces')
      .mockImplementation((data) => {
        if (data) {
          return mockMarketplaceTypes
        } else return Promise.reject()
      })

    const tree = render(
      <MemoryRouter>
        <UpdateCourierMappings />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
