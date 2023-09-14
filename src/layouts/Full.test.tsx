import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Full from './Full'

test('renders Full', async () => {
  const tree = render(
    <MemoryRouter>
      <Full />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
