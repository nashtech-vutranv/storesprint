import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import * as LayoutConstants from '../../constants'
import LayoutColor from './LayoutColor'

test('renders LayoutColor', async () => {
  const tree = render(
    <MemoryRouter>
      <LayoutColor
        changeLayoutColorScheme={jest.fn()}
        layoutColor='light'
        layoutConstants={LayoutConstants.LayoutColor}
      />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
