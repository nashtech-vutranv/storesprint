import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import {mockMarketplaceRelationships, mockOption} from '../../utils/factory'
import {Relationships} from '.'

const service = require('../../services/MarketplaceRelationshipService')

jest.mock(service, () => {
  const instance = jest.fn().mockReturnValue({
    getRelationshipsByFilter: jest.fn().mockImplementation(() => {
      Promise.resolve(mockMarketplaceRelationships)
    }),
  })

  return instance
})

beforeEach(() => {
  window.history.pushState({
    keepFilter: true,
    selectedOrganizations: [mockOption()],
    selectedSites: [mockOption()],
    selectedLocales: [mockOption()]
  }, '', '')
})

test('Render page View Marketplace Relationships', async () => {
  const tree = render(
    <MemoryRouter>
      <Relationships />
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

  await waitFor(() => {
    expect(
      tree.queryByText(/marketplace_relationships_fitler_title/i)
    ).toBeInTheDocument()
  })
  
  await waitFor(() => {
    expect(
      tree.getByText(/marketplace_relationships_organization_label/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      tree.queryByText(/marketplace_relationships_organization_placeHolder/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      tree.getByText(/marketplace_relationships_site_label/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      tree.queryByText(/marketplace_relationships_site_placeHolder/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      tree.getByText(/marketplace_relationships_locale_label/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      tree.queryByText(/marketplace_relationships_locale_placeHolder/i)
    ).toBeInTheDocument()

    expect(tree.getByText(/common_button_search_label/i)).toBeInTheDocument()
  })
})
