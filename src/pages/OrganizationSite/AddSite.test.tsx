import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {UpdateOrganizationSite} from '.'

jest.mock('../../services/SitesService', () => {
  const instance = jest.fn().mockReturnValue({
    createSite: jest.fn().mockImplementation((siteData: any) => {
      if (
        siteData.erpId !== 'exist_erp_id' &&
        siteData.url !== 'http://duplicate-site-url.com'
      ) {
        return Promise.resolve({
          data: {
            id: 'site-id',
            erpId: 'site_erp_id',
            name: 'site-name',
            organizationId: '',
            url: 'https://site-name.com',
            status: 'ACTIVE',
            version: 0,
            createdAt: '',
            modifiedAt: '',
          },
        })
      }
      const invalidFields = [] as any[]
      if (siteData.erpId === 'exist_erp_id') {
        invalidFields.push({errorMessage: 'DUPLICATE_SITE_ERP_ID'})
      }
      if (siteData.url === 'http://duplicate-site-url.com') {
        invalidFields.push({errorMessage: 'DUPLICATE_SITE_URL'})
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
  useParams: () => ({siteId: undefined, orgId: 'org-id'}),
}))

test('renders Add OrganizationSite', async () => {
  const tree = render(
    <MemoryRouter>
      <UpdateOrganizationSite />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })

  const saveBtn = tree.getByText(/common_confirm_save/i)
  fireEvent.click(saveBtn)
  const nameInput = tree.container.querySelector(
    'input[name="name"]'
  ) as Element
  await waitFor(() => expect(nameInput).toHaveClass('p-inputtext p-component p-inputtext-sm'))

  const urlInput = tree.container.querySelector('input[name="url"]') as Element
  await waitFor(() => {
    expect(urlInput).toHaveClass('p-inputtext p-component p-inputtext-sm')
  })
  
  const erpIdInput = tree.container.querySelector(
    'input[name="erpId"]'
  ) as Element
  await waitFor(() => {
    expect(erpIdInput).toHaveClass('p-inputtext p-component p-inputtext-sm')
  })
  
  fireEvent.change(nameInput, {target: {value: 'site-name'}})
  fireEvent.blur(nameInput)
  fireEvent.change(urlInput, {target: {value: 'https://site-name.com'}})
  fireEvent.blur(urlInput)
  fireEvent.change(erpIdInput, {target: {value: 'exist_erp_id'}})
  fireEvent.blur(erpIdInput)
  const switchInput = tree.container.querySelector('.p-inputswitch') as Element
  fireEvent.click(switchInput)
  await waitFor(() =>
    expect(switchInput).not.toHaveClass('p-inputswitch-checked')
  )
  fireEvent.click(switchInput)
  await waitFor(() => expect(switchInput).toHaveClass('p-inputswitch-checked'))
  fireEvent.click(saveBtn)
  await waitFor(() =>
    expect(
      tree.getByText(/form_validate_duplicated_erp_id/i)
    ).toBeInTheDocument()
  )
  fireEvent.change(erpIdInput, {target: {value: 'site_erp_id'}})
  fireEvent.change(urlInput, {target: {value: 'http://duplicate-site-url.com'}})
  fireEvent.click(saveBtn)
  await waitFor(() =>
    expect(
      tree.getByText(/form_validate_duplicated_site_url/i)
    ).toBeInTheDocument()
  )
  fireEvent.change(urlInput, {target: {value: 'https://site-name.com'}})
  fireEvent.click(saveBtn)
})
