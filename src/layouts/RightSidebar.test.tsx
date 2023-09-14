import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import RightSidebar from './RightSidebar'

test('renders RightSidebar', async () => {
  const tree = render(
    <MemoryRouter>
      <RightSidebar />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
