import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import MenuItem from './MenuItem'

test('renders MenuItem', async () => {
  const tree = render(
    <MemoryRouter>
      <MenuItem
        item={{key: 'more', label: 'test-label'}}
        className='test-classname'
        linkClassName='test-linkClassName'
      />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
