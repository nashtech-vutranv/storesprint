import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import Router, {MemoryRouter} from 'react-router-dom'
import {mockMarketplaces} from '../../utils/factory'
import MarketplaceService from '../../services/MarketplaceService'
import {Marketplaces} from '.'

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }
})

describe('Marketplaces Page', () => {
  it('should match snapshot', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({marketplaceId: '1'})

    jest
      .spyOn(new MarketplaceService(axios) as any, 'fetchAllMarketplaces')
      .mockImplementation(() => Promise.resolve(mockMarketplaces()))

      const marketplacesTree = render(
        <MemoryRouter>
          <Marketplaces />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(marketplacesTree).toMatchSnapshot()
      })
  })
})
