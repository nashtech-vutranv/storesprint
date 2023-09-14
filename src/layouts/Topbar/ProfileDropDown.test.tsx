import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

test('renders ProfileDropdown', async () => {
  const tree = render(
    <MemoryRouter>
      <ProfileDropdown
        username='test-user'
        menuItems={[{label: 'label', icon: '', onClick: jest.fn()}]}
      />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
