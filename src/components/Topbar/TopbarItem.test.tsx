import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import TopbarItem from './TopbarItem'

test('renders TopbarItem', async () => {
  const tree = render(
    <MemoryRouter>
      <TopbarItem
        liClassName='test-li'
        buttonClassName='test-button'
        iconClassName='test-icon'
      />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
