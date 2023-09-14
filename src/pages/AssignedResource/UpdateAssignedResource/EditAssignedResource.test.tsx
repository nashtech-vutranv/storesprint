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
  useParams: () => ({
    userId: 'test-user',
    resourceId: '756857162945396739',
  }),
}))

describe('Edit Assigned Resource Page', () => {
  it('should match snapshot', async () => {
    jest
      .spyOn(new ResourceService(axios) as any, 'getResourceById')
      .mockImplementation((resourceId) => {
        if (resourceId !== 'existed_resource') {
          return resourceMockData
        } else return Promise.reject()
      })

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
      .spyOn(new ResourceService(axios) as any, 'editResource')
      .mockImplementation((resourceId, updateResourceData) => {
        if (resourceId !== 'existed_resource' && updateResourceData) {
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
      expect(tree.getByText(/resource_edit_title/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_organization/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_site/i)).toBeInTheDocument()
      expect(tree.getByText(/resource_form_locale/i)).toBeInTheDocument()
    })
    
    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
    const cancelBtn = tree.getByText(/common_confirm_cancel/i)
    fireEvent.click(cancelBtn)
  })
})
