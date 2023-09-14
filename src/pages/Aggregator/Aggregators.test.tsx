import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import Router, {MemoryRouter} from 'react-router-dom'
import {mockAggregators} from '../../utils/factory'
import AggregatorService from '../../services/AggregatorService'
import {Aggregators} from './'

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }
})

describe('Aggregators Page', () => {
  it('should match snapshot', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({aggregatorId: '1'})

    jest
      .spyOn(new AggregatorService(axios) as any, 'fetchAllAggregators')
      .mockImplementation(() => Promise.resolve(mockAggregators()))

      const aggregatorsTree = render(
        <MemoryRouter>
          <Aggregators />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(aggregatorsTree).toMatchSnapshot()
      })
  })
})
