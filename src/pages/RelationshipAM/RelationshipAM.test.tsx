import {render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import {RelationshipAM} from '.'

const mockRelationshipAMs = Promise.resolve({
  data: {
    totalPages: 1,
    totalElements: 10,
    size: 1,
    content: [
      {
        id: 'test_id',
        createdAt: '2022-05-17T08:10:57.603Z',
        modifiedAt: '2022-05-17T08:10:57.603Z',
        version: 0,
        marketplaceId: 'test_mrk_id',
        aggregatorId: 'test_agg_id',
        status: 'ACTIVE',
        aggregator: {
          id: 'test_agg_id',
          createdAt: '2022-05-17T08:10:57.603Z',
          modifiedAt: '2022-05-17T08:10:57.603Z',
          version: 0,
          name: 'test_mrk_name',
          status: 'ACTIVE',
        },
        marketplace: {
          id: 'test_agg_id',
          createdAt: '2022-05-17T08:10:57.603Z',
          modifiedAt: '2022-05-17T08:10:57.603Z',
          version: 0,
          name: 'test_agg_name',
          status: 'ACTIVE',
          currencyId: 'AUD',
        },
      },
    ],
    number: 0,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true,
    },
    numberOfElements: 0,
    pageable: {
      offset: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      pageNumber: 0,
      pageSize: 0,
      paged: true,
      unpaged: true,
    },
    first: true,
    last: true,
    empty: true,
  },
})

jest.mock('../../services/RelationshipAMService', () => {
  const instance = jest.fn().mockReturnValue({
    getRelationshipAMs: jest.fn().mockImplementation(() => mockRelationshipAMs),
  })
  return instance
})

test('renders Relationship Aggregator and Marketplace Page', async () => {
  const tree = render(
    <MemoryRouter>
      <RelationshipAM />
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
    expect(
      tree.queryByText(/relationshipAM_column_header_aggregator/i)
    ).toBeInTheDocument()
  })
})
