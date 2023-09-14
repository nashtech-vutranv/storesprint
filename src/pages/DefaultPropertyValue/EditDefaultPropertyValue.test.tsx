import {render, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOption, mockResponseAddUpdateDefaultPropertyValue} from '../../utils/factory'
import {UpdateDefaultPropertyValue} from '.'

const renderComponent = () =>
  render(
    <MemoryRouter>
      <UpdateDefaultPropertyValue />
    </MemoryRouter>
  )

describe('Edit Default Property Value Page', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({defaultPropertyValueId: 'id'}),
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
        editDefaultPropertyValue: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockResponseAddUpdateDefaultPropertyValue)
        }),
      })
      return instance
    })
    const tree = renderComponent()
    expect(tree).toMatchSnapshot()
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
        editDefaultPropertyValue: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
      })
      return instance
    })

    const tree = renderComponent()
    expect(tree).toMatchSnapshot()
  })
})
