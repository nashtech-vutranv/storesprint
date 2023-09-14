import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import ThemeCustomizer from './ThemeCustomizer'

test('renders ThemeCustomizer', async () => {
  const tree = render(
    <MemoryRouter>
      <ThemeCustomizer />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
