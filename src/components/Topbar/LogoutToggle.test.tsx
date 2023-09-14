import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import LogoutToggle from './LogoutToggle'

test('renders LogoutToggle', async () => {
  const tree = render(
    <MemoryRouter>
      <LogoutToggle />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
