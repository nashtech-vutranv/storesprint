import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Navbar from './Navbar'

test('renders Navbar', async () => {
  const tree = render(
    <MemoryRouter>
      <Navbar isMenuOpened={true} />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
