import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Detached from './Detached'

test('renders Detached', async () => {
  const tree = render(
    <MemoryRouter>
      <Detached />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
