import {IAccordionActionType, AccordionActionType} from '../actions'
import {storeAccordionInfoToLocal, getAccordionFromLocal} from '../../helpers/localstorage'
import {IAccordion} from '../../interface/accordion'

const accordionInitialState: IAccordion = getAccordionFromLocal({
  warehouse: '0',
  product: '0',
  relationship: '0',
  assignedProduct: '0',
  user: '0',
  listingStatus: '0',
  mappings: '0',
  defaultPropertyValue: '0',
  order: '0',
  productCategoryMappings: '0',
  productPropertyMappings: '0',
  courierMappings: '0',
  deliveryTypeMappings: '0'
})

const accordionReducer = (state: IAccordion, action: IAccordionActionType<IAccordion>) => {
  switch (action.type) {
    case AccordionActionType.GET_CURRENT_ACCORDION_INFORMATION: {
      storeAccordionInfoToLocal(action.payload)
      return action.payload
    }
    default:
      return state
  }
}

export {accordionInitialState, accordionReducer}
