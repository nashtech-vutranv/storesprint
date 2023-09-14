import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import * as LayoutConstants from '../../constants'
import LayoutWidth from './LayoutWidth'

test('renders LayoutWidth', async () => {
  const tree = render(
    <MemoryRouter>
      <LayoutWidth
        changeWidthMode={jest.fn()}
        layoutWidth='300'
        layoutConstants={LayoutConstants.LayoutWidth}
      />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
