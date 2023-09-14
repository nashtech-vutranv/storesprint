import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import SearchDropdown from './SearchDropdown'

test('renders SearchDropdown', async () => {
  const tree = render(
    <MemoryRouter>
      <SearchDropdown />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
