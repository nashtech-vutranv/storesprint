import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import LanguageDropdown from './LanguageDropdown'

test('renders LanguageDropdown', async () => {
  const tree = render(
    <MemoryRouter>
      <LanguageDropdown />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
