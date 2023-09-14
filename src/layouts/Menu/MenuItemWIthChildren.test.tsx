import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import MenuItemWithChildren from './MenuItemWithChildren'

test('renders MenuItemWithChildren', async () => {
  const tree = render(
    <MemoryRouter>
      <MenuItemWithChildren
        item={{key: 'more', label: 'test-label'}}
        className='test-classname'
        linkClassName='test-linkClassName'
        activeMenuItems={['menuItem1, menuItem2']}
      />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
