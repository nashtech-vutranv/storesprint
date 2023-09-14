import {render, waitFor, fireEvent} from '@testing-library/react'
import Router, {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {UpdateSiteLocale} from '../'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.spyOn(Router, 'useParams').mockReturnValue({
  siteLocaleId: 'site-locale-id',
  siteId: 'site-id',
  orgId: 'org-id',
})

const siteLocaleReturn = Promise.resolve({
  data: {
    id: '751977548606963714',
    createdAt: '2022-04-10T01:55:35.868052Z',
    modifiedAt: '2022-04-10T01:55:35.868052Z',
    version: 0,
    erpId: '5667',
    siteId: '750615358018748418',
    localeId: 'ar_AE',
    platformId: 'null',
    name: 'Arabic - United Arab Emirates',
    url: 'asdas.com.vn',
    status: 'ACTIVE',
  },
})

const localeList = Promise.resolve({
  data: [
    {
      id: 'ar_AE',
      createdAt: null,
      modifiedAt: null,
      version: 0,
      name: 'Arabic - United Arab Emirates',
    },
  ],
})

jest.mock('../../../services/SiteLocaleService', () => {
  const instance = jest.fn().mockReturnValue({
    getLocaleBySiteId: jest.fn().mockImplementation(() => siteLocaleReturn),
    getUnassignedLocales: jest.fn().mockImplementation(() => localeList),
  })
  return instance
})

test('renders Edit Site Locale', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateSiteLocale />
    </MemoryRouter>
  )
  await waitFor(() =>
    expect(
      tree.getByDisplayValue(/Arabic - United Arab Emirates/i)
    ).toBeInTheDocument()
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  await waitFor(() => {
    expect(tree.getByText(/siteLocales_edit_title/i)).toBeInTheDocument()
  })
  fireEvent.click(tree.getByText(/common_confirm_save/i))
})
