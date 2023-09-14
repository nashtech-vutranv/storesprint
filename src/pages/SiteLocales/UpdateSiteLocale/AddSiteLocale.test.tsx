import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {UpdateSiteLocale} from '../'

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
    getUnassignedLocales: jest.fn().mockImplementation(() => localeList),
    addLocale: jest.fn().mockImplementation((siteLocale) => {
      if (
        siteLocale.erpId !== 'exist-erp-id' &&
        siteLocale.url !== 'http://exist-url.com'
      ) {
        return Promise.resolve({
          data: {
            id: 'id',
            createdAt: '2022-04-10T01:55:35.868052Z',
            modifiedAt: '2022-04-10T01:55:35.868052Z',
            version: 0,
            erpId: 'valid-erp-id',
            siteId: 'site-id',
            localeId: 'ar_AE',
            platformId: 'null',
            name: 'Arabic - United Arab Emirates',
            url: 'http://valid-url.com',
            status: 'ACTIVE',
          },
        })
      }
      const invalidFields = [] as any[]
      if (siteLocale.erpId === 'exist-erp-id') {
        invalidFields.push({errorMessage: 'DUPLICATE_SITE_LOCALE_ERP_ID'})
      }
      if (siteLocale.url === 'http://exist-url.com') {
        invalidFields.push({errorMessage: 'DUPLICATE_SITE_LOCALE_URL'})
      }
      return Promise.reject({
        response: {
          data: {
            errorCode: 'FIELD_INVALID',
            invalidFields: invalidFields,
          },
          status: 409,
        },
      })
    }),
  })
  return instance
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    siteLocaleId: undefined,
    siteId: 'site-id',
    orgId: 'org-id',
  }),
}))

test('renders Add Site Locale', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateSiteLocale />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  const saveBtn = tree.getByText(/common_confirm_save/i)
  fireEvent.click(saveBtn)
  const urlInput = tree.container.querySelector('input[name="url"]') as Element
  fireEvent.change(urlInput, {target: {value: 'invalid-url'}})
  fireEvent.blur(urlInput)
  const erpIdInput = tree.container.querySelector(
    'input[name="erpId"]'
  ) as Element
  fireEvent.change(erpIdInput, {target: {value: 'exist-erp-id'}})
  fireEvent.blur(erpIdInput)
  fireEvent.click(saveBtn)
  await waitFor(() =>
    expect(tree.getByText(/form_validate_invalid_url/i)).toBeInTheDocument()
  )
  const switchInput = tree.container.querySelector('.p-inputswitch') as Element
  fireEvent.click(switchInput)
  await waitFor(() =>
    expect(switchInput).not.toHaveClass('p-inputswitch-checked')
  )
  fireEvent.click(switchInput)
  await waitFor(() => expect(switchInput).toHaveClass('p-inputswitch-checked'))
  fireEvent.change(urlInput, {target: {value: 'http://exist-url.com'}})
  fireEvent.click(saveBtn)
  fireEvent.change(erpIdInput, {target: {value: 'valid-erp-id'}})
  fireEvent.click(saveBtn)
  fireEvent.change(urlInput, {target: {value: 'http://valid-url.com'}})
  fireEvent.click(saveBtn)
})
