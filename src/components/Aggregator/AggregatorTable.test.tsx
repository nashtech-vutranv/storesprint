import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockAggregators} from '../../utils/factory'
import AggregatorTable from './AggregatorTable'

const tree = render(
  <MemoryRouter>
    <AggregatorTable />
  </MemoryRouter>
)

jest.mock('../../services/AggregatorService', () => {
  const instance = jest.fn().mockReturnValue({
    fetchAllAggregators: jest.fn().mockImplementation(() => {
      return Promise.resolve(mockAggregators())
    }),
  })

  return instance
})

describe('Aggregator Table', () => {
  it('should match snapshot', async () => {
      waitFor(() => {
        expect(tree).toMatchSnapshot()
      })
    })
})
