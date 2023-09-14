import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Default from './Default'

test('renders Default', async () => {
  const tree = render(
    <MemoryRouter>
      <Default />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
