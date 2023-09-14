import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import axios from 'axios'
import {mockAssignedResource, mockOrganizations, mockSites} from '../../../utils/factory'
import ResourceService from '../../../services/ResourceService'
import UpdateAssignedResource from '.'

const resourceMockData = Promise.resolve(mockAssignedResource())

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({userId: 'test-user', resourceId: undefined}),
}))

describe('Add Assigned Resource Page', () => {
  it('should match snapshot', async () => {
    jest
      .spyOn(
        new ResourceService(axios) as any,
        'getOrganizationsByExcludedAllSiteOption'
      )
      .mockImplementation((userId) => {
        if (userId !== 'existed_user') {
          return Promise.resolve(mockOrganizations())
        } else return Promise.reject()
      })

    jest
      .spyOn(
        new ResourceService(axios) as any,
        'getSitesBySelectedExcludedAllSiteOrganization'
      )
      .mockImplementation((userId, orgId) => {
        if (userId !== 'existed_user' || orgId !== 'existed_org') {
          return Promise.resolve(mockSites())
        } else return Promise.reject()
      })

    jest
      .spyOn(new ResourceService(axios) as any, 'addResource')
      .mockImplementation((addResourceData) => {
        if (addResourceData) {
          return resourceMockData
        } else return Promise.reject()
      })

    const tree = render(
      <MemoryRouter>
        <UpdateAssignedResource />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
      expect(tree.getByText(/resource_add_title/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_organization/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_site/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_locale/i)).toBeInTheDocument()
    })

    const orgSelect = tree.container.querySelectorAll(
      'input[role="combobox"]'
    )[0] as Element

    const siteSelect = tree.container.querySelectorAll(
      'input[role="combobox"]'
    )[1] as Element

    const localeSelect = tree.container.querySelectorAll(
      'input[role="combobox"]'
    )[2] as Element

    fireEvent.change(orgSelect, {target: {value: 'org-selected'}})
    fireEvent.blur(orgSelect)
    fireEvent.change(siteSelect, {target: {value: 'site-selected'}})
    fireEvent.blur(siteSelect)

    await waitFor(() => {
      expect(localeSelect).toHaveProperty('disabled')
    })

    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
    const cancelBtn = tree.getByText(/common_confirm_cancel/i)
    fireEvent.click(cancelBtn)
  })
})
