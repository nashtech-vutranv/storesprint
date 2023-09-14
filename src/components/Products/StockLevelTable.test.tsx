import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockMultipleWarehouseProductStock} from '../../utils/factory'
import StockLevelTable from './StockLevelTable'

const tree = render(
  <MemoryRouter>
    <StockLevelTable />
  </MemoryRouter>
)

describe('StockLevel Table', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/ProductService', () => {
      const instance = jest.fn().mockReturnValue({
        getTotalStockLevelByProductId: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              totalStockLevel: 100,
            },
          })
        }),
        getWarehouseProductStockByProductId: jest
          .fn()
          .mockImplementation(() => {
            return Promise.resolve({
              data: {
                content: mockMultipleWarehouseProductStock(),
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
    jest.mock('../../services/ProductService', () => {
      const instance = jest.fn().mockReturnValue({
        getTotalStockLevelByProductId: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
        getWarehouseProductStockByProductId: jest
          .fn()
          .mockImplementation(() => {
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
