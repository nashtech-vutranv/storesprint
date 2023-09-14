import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import TopbarSearch from './TopbarSearch'

test('renders TopbarSearch', async () => {
  const tree = render(
    <MemoryRouter>
      <TopbarSearch options={[{label: 'label', type: 'type'}]} />
    </MemoryRouter>
  )
  expect(tree).toMatchSnapshot()
})
