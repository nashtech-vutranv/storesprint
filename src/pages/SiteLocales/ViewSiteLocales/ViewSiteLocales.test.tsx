import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {ViewSiteLocales} from '../'

const siteLocalesReturn = Promise.resolve({
  data: {
    content: [
      {
        id: '752040217925451778',
        createdAt: '2022-04-10T07:14:21.029120Z',
        modifiedAt: '2022-04-10T07:14:21.029120Z',
        version: 0,
        erpId: '346737',
        siteId: '750615361041334274',
        localeId: 'vi_VN',
        platformId: 'null',
        name: 'Vietnamese - Viet Nam',
        url: 'https://www.ormllc.com.vn',
        status: 'ACTIVE',
      },
    ],
    totalElements: 1,
  },
})

jest.mock('../../../services/SitesService', () => {
  const instance = jest.fn().mockReturnValue({
    getSiteLocales: jest.fn().mockImplementation(() => siteLocalesReturn),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({siteId: 'site-id'}),
}))

test('renders ViewSiteLocales', async () => {
  const tree = render(
    <MemoryRouter>
      <ViewSiteLocales />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  const refresh = tree.container.querySelector(
    '.p-button-icon.pi-refresh'
  ) as Element
  await waitFor(() => {
    expect(refresh).toBeTruthy()
  })
  
  fireEvent.click(refresh)
  await waitFor(() =>
    expect(tree.queryByText(/Vietnamese - Viet Nam/i)).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(tree.queryByText(/https:\/\/www.ormllc.com.vn/i)).toBeInTheDocument()
  })
})
