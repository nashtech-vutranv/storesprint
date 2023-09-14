import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import PageTitle from './PageTitle'

test('renders PageTitle', async () => {
  const tree = render(
    <MemoryRouter>
      <PageTitle title='page-title' />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
