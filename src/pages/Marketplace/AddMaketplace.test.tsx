import axios from 'axios'
import {fireEvent, render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import MarketplaceService from '../../services/MarketplaceService'
import CurrencyService from '../../services/CurrencyService'
import {mockMarketplace} from '../../utils/factory'
import {UpdateMarketplaces} from '.'

const tree = render(
    <MemoryRouter>
      <UpdateMarketplaces />
    </MemoryRouter>
  )

describe('Add Marketplace Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => {
      return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({marketplaceId: undefined}),
      }
    })
  })

  it('should match snapshot with successful data from api', async () => {
    jest
      .spyOn(new CurrencyService(axios) as any, 'fetchAllCurrencies')
      .mockImplementation((currenciesData) => {
        if (currenciesData) {
          return currenciesData
        } else return Promise.reject()
      })

    jest
      .spyOn(new MarketplaceService(axios) as any, 'addMarketplace')
      .mockImplementation((marketplaceId) => {
        if (marketplaceId !== 'existed_marketplace_id') {
          return Promise.resolve({data: mockMarketplace()})
        } else return Promise.reject()
      })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
      expect(tree.getByText(/marketplace_add_title/i)).toBeInTheDocument()
      expect(tree.getByText(/marketplace_details_name/i)).toBeInTheDocument()
      expect(
        tree.getByText(/marketplace_details_status_active/i)
      ).toBeInTheDocument()
    })
    
    const currencySelect = tree.container.querySelectorAll(
      'input[role="combobox"]'
    )[0] as Element

    fireEvent.change(currencySelect, {target: {value: 'cur-selected'}})
    fireEvent.blur(currencySelect)

    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
    const cancelBtn = tree.getByText(/common_confirm_cancel/i)
    fireEvent.click(cancelBtn)
  })
})
