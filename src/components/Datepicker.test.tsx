import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import Datepicker from './Datepicker'

test('renders Datepicker', async () => {
  const tree = render(
    <MemoryRouter>
      <Datepicker
        value={new Date('2022-04-20T12:00:00')}
        onChange={jest.fn()}
      />
    </MemoryRouter>
  )

  await waitFor(() => {
     expect(tree).toMatchSnapshot()
  })
})
