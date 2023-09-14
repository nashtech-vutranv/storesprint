import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockMarketplaces} from '../../utils/factory'
import MarketplaceTable from './MarketplaceTable'

jest.mock('../../services/MarketplaceService', () => {
  const instance = jest.fn().mockReturnValue({
    fetchAllMarketplaces: jest.fn().mockImplementation(() => {
      return Promise.resolve(mockMarketplaces())
    }),
  })

  return instance
})

describe('Marketplace Table', () => {
    it('should match snapshot', async () => {
      const tree = render(
        <MemoryRouter>
          <MarketplaceTable />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(tree).toMatchSnapshot()
      })
    })
})
