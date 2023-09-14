import axios from 'axios'
import {fireEvent, render, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'
import AggregatorService from '../../services/AggregatorService'
import MarketplaceService from '../../services/MarketplaceService'
import RelationshipAMService from '../../services/RelationshipAMService'
import {mockMarketplaces, mockAggregators, mockRelationshipAM} from '../../utils/factory'
import {UpdateRelationshipAM} from '.'

const tree = render(
    <MemoryRouter>
      <UpdateRelationshipAM />
    </MemoryRouter>
  )

describe('Add RelationshipAM Page', () => {
  it('should match snapshot with api service', async () => {
    jest
      .spyOn(new AggregatorService(axios) as any, 'fetchAllAggregators')
      .mockImplementation((data) => {
        if (data) {
          return mockAggregators()
        } else return Promise.reject()
      })

    jest
      .spyOn(new MarketplaceService(axios) as any, 'fetchAllMarketplaces')
      .mockImplementation((data) => {
        if (data) {
          return mockMarketplaces()
        } else return Promise.reject()
      })

    jest
      .spyOn(new RelationshipAMService(axios) as any, 'addRelationshipAM')
      .mockImplementation((data) => {
        if (data) {
          return mockRelationshipAM()
        } else return Promise.reject()
      })

    await waitFor(() => {
      expect(tree).toMatchSnapshot()
      expect(tree.getByText(/relationshipAM_add_title/i)).toBeInTheDocument()
      expect(
        tree.getByText(/relationshipAM_details_aggregator/i)
      ).toBeInTheDocument()
      expect(
        tree.getByText(/relationshipAM_details_marketplace/i)
      ).toBeInTheDocument()
      expect(
        tree.getByText(/relationshipAM_details_status_active/i)
      ).toBeInTheDocument()
    })
    
    const elementSelect = tree.container.querySelectorAll(
      'input[role="combobox"]'
    )[0] as Element

    fireEvent.change(elementSelect, {target: {value: 'cur-selected'}})
    fireEvent.blur(elementSelect)

    const saveBtn = tree.getByText(/common_confirm_save/i)
    fireEvent.click(saveBtn)
    const cancelBtn = tree.getByText(/common_confirm_cancel/i)
    fireEvent.click(cancelBtn)
  })
})
