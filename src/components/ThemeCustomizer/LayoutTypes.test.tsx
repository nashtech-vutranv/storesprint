import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import * as LayoutConstants from '../../constants'
import LayoutTypes from './LayoutTypes'

test('renders LayoutTypes', async () => {
  const tree = render(
    <MemoryRouter>
      <LayoutTypes
        changeLayoutType={jest.fn()}
        layoutType='horizontal'
        layoutConstants={LayoutConstants.LayoutTypes}
      />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
