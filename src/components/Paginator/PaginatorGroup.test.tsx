import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import PaginatorGroup from './PaginatorGroup'

test('renders PaginatorGroup', async () => {
  const tree = render(
    <MemoryRouter>
      <PaginatorGroup />
    </MemoryRouter>
  )
  
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
