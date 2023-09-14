import {BrowserRouter as Router} from 'react-router-dom'
import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import BreadCrumb from './BreadCrumb'

test('renders BreadCrumb', async () => {
  const {getByText} = render(
    <Router>
      <BreadCrumb breadCrumbItems={[{label: 'Org name', active: true}]} />
    </Router>
  )

  await waitFor(() => {
    expect(getByText(/navigator_title_organizations/g)).toBeTruthy()
    expect(getByText(/Org name/g)).toBeTruthy()
  })
})
