import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import LanguageToggle from './LanguageToggle'

test('renders LanguageToggle', async () => {
  const tree = render(
    <MemoryRouter>
      <LanguageToggle />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
