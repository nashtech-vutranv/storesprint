import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockMultipleProductPrice} from '../../utils/factory'
import ProductPriceTable from './ProductPriceTable'

const tree = render(
  <MemoryRouter>
    <ProductPriceTable />
  </MemoryRouter>
) 

describe('Product Price Table', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/ProductService', () => {
      const instance = jest.fn().mockReturnValue({
        getPricesByProductId: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              content: mockMultipleProductPrice(),
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
        getPricesByProductId: jest.fn().mockImplementation(() => {
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
