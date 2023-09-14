import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, {MemoryRouter} from 'react-router-dom'
import {mockOption} from '../../../utils/factory'
import {EditWarehouse} from '../'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: any) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {
          // do smth
        }),
      },
    }
  },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

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

jest.spyOn(Router, 'useParams').mockReturnValue({id: 'id'})

const siteLocaleReturn = Promise.resolve({
  data: {
    id: '751917528603943754',
    createdAt: '2022-04-13T02:35:24.862052Z',
    modifiedAt: '2022-04-13T02:35:24.862052Z',
    version: 0,
    erpId: '12345',
    platformId: 'null',
    name: 'Warehoue Name',
    status: 'ACTIVE',
  },
})

jest.mock('../../../services/WarehouseService', () => {
  const instance = jest.fn().mockReturnValue({
    getWarehouseById: jest.fn().mockImplementation(() => siteLocaleReturn),
  })
  return instance
})

test('renders Edit Warehouse', async () => {
  const tree = render(
    <MemoryRouter>
      <EditWarehouse />
    </MemoryRouter>
  )

  expect(tree).toMatchSnapshot()
  expect(tree.getByText(/warehouse_edit_page_title/i)).toBeInTheDocument()
})
