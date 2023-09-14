import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Vertical from './Vertical'

test('renders Vertical', async () => {
  const tree = render(
    <MemoryRouter>
      <Vertical />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
