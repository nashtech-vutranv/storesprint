import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {IImportProductPropertiesResult} from '../../interface'
import {ImportResult} from './'

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }
})

beforeEach(() => {
  window.history.pushState(
    {
      errorMessage: '',
      invalidProperties: [],
      success: 0,
      total: 0,
    } as IImportProductPropertiesResult,
    '',
    ''
  )
})

describe('Import result Page', () => {
  it('should match snapshot', async () => {
    const importResultTree = render(
      <MemoryRouter>
        <ImportResult />
      </MemoryRouter>
    )
    expect(importResultTree).toMatchSnapshot()
  })
})
