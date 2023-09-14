import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Spinner from './Spinner'

test('renders Spinner', async () => {
  const tree = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
