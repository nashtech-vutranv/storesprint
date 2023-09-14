import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockAggregator} from '../../utils/factory'
import UpdateAggregators from './UpdateAggregators'

const tree = render(
  <MemoryRouter>
    <UpdateAggregators />
  </MemoryRouter>
)

describe('Add Aggregator Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => {
      return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({aggregatorId: undefined}),
      }
    })
  })

  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/AggregatorService', () => {
      const instance = jest.fn().mockReturnValue({
        addAggregator: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockAggregator)
        }),
      })

      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })

    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)

    const nameInput = tree.container.querySelector(
      'input[name="name"]'
    ) as Element

    await waitFor(() => expect(nameInput).toHaveClass('p-inputtext p-component w-full p-1'))

    const switchInput = tree.container.querySelector(
      '.p-inputswitch'
    ) as Element
    fireEvent.click(switchInput)
    await waitFor(() =>
      expect(switchInput).not.toHaveClass('p-inputswitch-checked')
    )

    fireEvent.click(switchInput)
    await waitFor(() =>
      expect(switchInput).toHaveClass('p-inputswitch-checked')
    )
  })

  it('should match snapshot with error from API', async () => {
    jest.mock('../../services/AggregatorService', () => {
      const mockValue = jest.fn().mockReturnValue({
        addAggregator: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
      })

      return mockValue
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
