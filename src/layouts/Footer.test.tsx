import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Footer from './Footer'

test('renders Footer', async () => {
  const tree = render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
