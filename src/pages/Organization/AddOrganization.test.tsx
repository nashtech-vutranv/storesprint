import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOrganization} from '../../utils/factory'
import {UpdateOrganizations} from '.'

const tree = render(
    <MemoryRouter>
      <UpdateOrganizations />
    </MemoryRouter>
  )

describe('Add Organizations Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({orgId: undefined}),
    }))
  })

  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/OrganizationService', () => {
      const instance = jest.fn().mockReturnValue({
        addOrganization: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockOrganization)
        }),
      })
      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })

    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
    const nameInput = tree.container.querySelector(
      'input[name="name"]'
    ) as Element
    await waitFor(() => expect(nameInput).toHaveClass('p-inputtext p-component w-full p-1'))
    const urlInput = tree.container.querySelector(
      'input[name="name"]'
    ) as Element
    await waitFor(() => {
      expect(urlInput).toHaveClass('p-inputtext p-component w-full p-1')
    })
    
    const erpIdInput = tree.container.querySelector(
      'input[name="erpId"]'
    ) as Element
    await waitFor(() => {
      expect(erpIdInput).toHaveClass('p-inputtext p-component w-full p-1')
    })
    
    const switchInput = tree.container.querySelector(
      '.p-inputswitch'
    ) as Element
    fireEvent.click(switchInput)
    await waitFor(() =>
      expect(switchInput).not.toHaveClass('p-inputswitch-checked')
    )
    fireEvent.click(switchInput)
    await waitFor(() =>
      expect(switchInput).toHaveClass('p-inputswitch-checked')
    )
    const clientIdInput = tree.container.querySelector(
      'input[name="platformSetting.clientId"]'
    ) as Element
    await waitFor(() => {
      expect(clientIdInput).toHaveClass('p-inputtext p-component w-full p-1')
    })
    
    const clientSecretInput = tree.container.querySelector(
      'input[name="platformSetting.clientSecret"]'
    ) as Element
    await waitFor(() => {
      expect(clientSecretInput).toHaveClass(
        'p-inputtext p-component w-full p-1'
      )
    })
    
    const apiEndpointInput = tree.container.querySelector(
      'input[name="platformSetting.apiEndpoint"]'
    ) as Element
    await waitFor(() => {
      expect(apiEndpointInput).toHaveClass('p-inputtext p-component w-full p-1')
    })
  })

  it('should match snapshot with error from API', async () => {
    jest.mock('../../services/OrganizationService', () => {
      const instance = jest.fn().mockReturnValue({
        addOrganization: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
      })
      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
