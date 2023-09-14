import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import axios from 'axios'
import {
  mockGetMarketplaceMapping,
  mockMarketplaceDeliveryService,
  mockMarketplaceTypes,
} from '../../utils/factory'
import DeliveryService from '../../services/DeliveryService'
import MappingService from '../../services/MappingService'
import UpdateDeliveryTypeMappings from './UpdateDeliveryTypeMappings'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({deliveryTypeMappingId: 'test-delivery-type-mapping-id'}),
}))

describe('Add Delivery Type Mapping Page', () => {
  it('should match snapshot', async () => {
    jest
      .spyOn(new DeliveryService(axios) as any, 'getMarketplaceDeliveryService')
      .mockImplementation((marketplaceTypeId) => {
        if (marketplaceTypeId) {
          return Promise.resolve(mockMarketplaceDeliveryService())
        } else return Promise.reject()
      })

    jest
      .spyOn(new MappingService(axios) as any, 'getMarketplaceMapping')
      .mockImplementation((id) => {
        if (id) {
          return Promise.resolve(mockGetMarketplaceMapping())
        } else return Promise.reject()
      })

    jest
      .spyOn(new MappingService(axios) as any, 'getAllMappingMarketplaces')
      .mockImplementation((data) => {
        if (data) {
          return Promise.resolve(mockMarketplaceTypes())
        } else return Promise.reject()
      })

    jest
      .spyOn(new DeliveryService(axios) as any, 'getDeliveryTypes')
      .mockImplementation((data) => {
        if (data) {
          return Promise.resolve(mockGetMarketplaceMapping())
        } else return Promise.reject()
      })

    const tree = render(
      <MemoryRouter>
        <UpdateDeliveryTypeMappings />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
