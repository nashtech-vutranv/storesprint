import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockMultipleShipment} from '../../utils/factory'
import ShipmentTable from './ShipmentTable'

const tree = render(
  <MemoryRouter>
    <ShipmentTable />
  </MemoryRouter>
)

describe('Order Shipment Table', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/OrderService', () => {
      const instance = jest.fn().mockReturnValue({
        getShipments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              content: mockMultipleShipment(),
            },
          })
        }),
      })

      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })

  it('should match snapshot with error from API', async () => {
    jest.mock('../../services/OrderService', () => {
      const instance = jest.fn().mockReturnValue({
        getShipments: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
      })

      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
