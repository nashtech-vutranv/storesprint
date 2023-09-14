import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockMarketplaceProducts} from '../../utils/factory'
import MarketplaceTable from './MarketplaceTable'

const tree = render(
  <MemoryRouter>
    <MarketplaceTable />
  </MemoryRouter>
)

describe('Marketplace Table', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/ProductService', () => {
      const instance = jest.fn().mockReturnValue({
        getMarketplacesByProductId: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              content: mockMarketplaceProducts(),
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
        getMarketplacesByProductId: jest.fn().mockImplementation(() => {
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
