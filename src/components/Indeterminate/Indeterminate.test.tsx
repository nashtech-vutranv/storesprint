import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Indeterminate from './Indeterminate'

describe('Indeterminate', () => {
  it('should match snapshot', async () => {
    const tree = render(
      <MemoryRouter>
        <Indeterminate indeterminate='' id='test_id' />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
