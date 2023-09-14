import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {mockOption, mockWarehouses} from '../../utils/factory'
import {Warehouse} from '.'

const API = require('../../services/WarehouseService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getWarehouseByFilter: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockWarehouses)),
  })
  return instance
})

beforeEach(() => {
  window.history.pushState(
    {
      selectedOrganizations: [mockOption()],
      eventKey: '0',
      currentStatus: null
    },
    '',
    ''
  )
})

test('renders Warehouse', async () => {
  const tree = render(
    <MemoryRouter>
      <Warehouse />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
})
