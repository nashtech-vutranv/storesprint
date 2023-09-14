
import {ModalActionType, ModalStateType, ModalActionTypes} from '../actions'
import {
  changeBodyAttribute,
  changeRootAttribute,
  removeFocusableOnElement,
  resetForcusableOnElement,
} from '../../utils/layout'

const modalInitialState: ModalStateType = {
  openModal: false
}

const modalReducer = (state: ModalStateType, action: ModalActionType) => {
  switch (action.type) {
    case ModalActionTypes.OPEN_MODAL:
      changeBodyAttribute('modal', 'open')
      changeBodyAttribute('tabindex', '-1')
      changeRootAttribute('aria-hidden', 'true')
      changeRootAttribute('tabIndex', '-1')
      removeFocusableOnElement()
      return {
        openModal: true,
      }
    case ModalActionTypes.CLOSE_MODAL:
      changeBodyAttribute('modal', 'close')
      changeRootAttribute('aria-hidden', 'false')
      changeRootAttribute('tabIndex', '0')
      resetForcusableOnElement()
      return {
        openModal: false,
      }
    default:
      return state
  }
}

export {modalInitialState, modalReducer}
