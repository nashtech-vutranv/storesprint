import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOption, mockResponseAddUpdateDefaultPropertyValue} from '../../utils/factory'
import UpdateDefaultPropertyValue from './UpdateDefaultPropertyValue'

const tree = render(
    <MemoryRouter>
      <UpdateDefaultPropertyValue />
    </MemoryRouter>
  )

describe('Add Default Property Value Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({defaultPropertyValueId: undefined}),
    }))

    window.history.pushState({
      selectedOrganizations: [mockOption()],
      selectedProperties: [mockOption()],
      selectedLocales: [mockOption()]
    }, '', '')
  })

  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/DefaultPropertyValueService', () => {
      const instance = jest.fn().mockReturnValue({
        addDefaultPropertyValue: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockResponseAddUpdateDefaultPropertyValue)
        }),
      })
      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
      expect(
        tree.queryByText(/default_property_value_add_title/i)
      ).toBeInTheDocument()
    })
    
    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
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
  })

  it('should match snapshot with error from API', async () => {
    jest.mock('../../services/DefaultPropertyValueService', () => {
      const instance = jest.fn().mockReturnValue({
        addDefaultPropertyValue: jest.fn().mockImplementation(() => {
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
