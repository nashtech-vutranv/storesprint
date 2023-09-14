import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {EmptyPage} from '.'

test('renders Empty Page', async () => {
  const tree = render(
    <MemoryRouter>
      <EmptyPage />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
