import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

test('renders LeftSidebar', async () => {
  const tree = render(
    <MemoryRouter>
      <LeftSidebar hideUserProfile={true} isLight={false} isCondensed={true} />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
