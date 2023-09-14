import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import * as LayoutConstants from '../../constants'
import LeftSideBarTheme from './LeftSideBarTheme'

test('renders LeftSideBarTheme', async () => {
  const tree = render(
    <MemoryRouter>
      <LeftSideBarTheme
        changeLeftSidebarTheme={jest.fn()}
        leftSideBarTheme='light'
        layoutConstants={LayoutConstants.SideBarTheme}
      />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
