import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import CardTitle from './CardTitle'

test('renders Datepicker', async () => {
  const tree = render(
    <MemoryRouter>
      <CardTitle
        menuItems={[{label: 'label'}]}
        title='card-title'
        containerClass='container-class'
      />
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
