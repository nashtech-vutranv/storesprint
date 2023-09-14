import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOrderLines} from '../../utils/factory'
import OrderlineTable from './OrderlineTable'

const tree = render(
  <MemoryRouter>
    <OrderlineTable />
  </MemoryRouter>
)

describe('Orderline Table', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/OrderService', () => {
      const instance = jest.fn().mockReturnValue({
        getOrderlines: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockOrderLines())
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
        getOrderlines: jest.fn().mockImplementation(() => {
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
