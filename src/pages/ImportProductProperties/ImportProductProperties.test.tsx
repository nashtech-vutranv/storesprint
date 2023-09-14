import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {ImportProductProperties} from './'

const tree = render(
    <MemoryRouter>
      <ImportProductProperties />
    </MemoryRouter>
  )

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }
})

describe('Import product properties Page', () => {
  it('should match snapshot with successful data from api', async () => {
    jest.mock('../../services/ImportProductPropertiesService', () => {
      const instance = jest.fn().mockReturnValue({
        importProductProperties: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              errorMessage: '',
              invalidProperties: [],
              success: 0,
              total: 0,
            },
          })
        }),
      })

      return instance
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
      expect(
        tree.queryByText(/import_product_properties_title/i)
      ).toBeInTheDocument()
      expect(
        tree.queryByText(/import_product_properties_choose_file/i)
      ).toBeInTheDocument()
      expect(
        tree.queryByText(/import_product_properties_allow_override/i)
      ).toBeInTheDocument()
      expect(tree.queryByText(/common_confirm_cancel/i)).toBeInTheDocument()
      expect(tree.queryByText(/common_submit/i)).toBeInTheDocument()
    })
  })

  it('should match snapshot with error from API', async () => {
    jest.mock('../../services/ImportProductPropertiesService', () => {
      const mockValue = jest.fn().mockReturnValue({
        importProductProperties: jest.fn().mockImplementation(() => {
          return Promise.reject()
        }),
      })

      return mockValue
    })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
    })
  })
})
