import {BrowserRouter as Router} from 'react-router-dom'
import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import CustomToggle from './CustomToggle'

test('renders CustomToggle', async () => {
  const tree = render(
    <Router>
      <CustomToggle
        eventKey='test-key'
        containerClass='test-ctn'
        linkClass='test-lcl'
        name='relationship'
      />
    </Router>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
