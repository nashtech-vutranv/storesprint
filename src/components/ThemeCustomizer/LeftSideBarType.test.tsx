import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import * as LayoutConstants from '../../constants'
import LeftSideBarType from './LeftSideBarType'

test('renders LeftSideBarType', async () => {
  const tree = render(
    <MemoryRouter>
      <LeftSideBarType
        changeLeftSiderbarType={jest.fn()}
        leftSideBarType='expand'
        layoutConstants={LayoutConstants.SideBarWidth}
      />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
