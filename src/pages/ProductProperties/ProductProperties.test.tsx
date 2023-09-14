import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockProductProperties} from '../../utils/factory'
import {ProductProperties} from '.'

const API = require('../../services/ProductPropertiesService')

jest.mock(API, () => {
  const instance = jest.fn().mockReturnValue({
    getProductProperties: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: mockProductProperties(),
      })
    ),
  })
  return instance
})

test('renders ProductProperties Page', async () => {
  const tree = render(
    <MemoryRouter>
      <ProductProperties />
    </MemoryRouter>
  )
  await waitFor(() => {
    expect(tree).toMatchSnapshot()
  })
  
  const refresh = tree.container.querySelector(
    '.p-button-icon.pi-refresh'
  ) as Element
  await waitFor(() => {
    expect(refresh).toBeTruthy()
  })
  
  fireEvent.click(refresh)
  await waitFor(() =>
    expect(
      tree.queryByText(/product_properties_page_title/i)
    ).toBeInTheDocument()
  )
})
