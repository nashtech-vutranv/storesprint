import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'

test('renders NotificationDropdown', async () => {
  const tree = render(
    <MemoryRouter>
      <NotificationDropdown
        notifications={[
          {
            day: 'today',
            messages: [
              {id: 1, title: 'ms-title', isRead: true, subText: 'sub'},
            ],
          },
        ]}
      />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
