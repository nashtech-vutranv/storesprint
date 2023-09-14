import {LayoutWidth, SideBarWidth} from '../constants'
import {LayoutActionType, LayoutActionTypes} from '../store/actions'

type ConfigType = {
    leftSideBarType:
    | SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
    | SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
    | SideBarWidth.LEFT_SIDEBAR_TYPE_SCROLLABLE
}

let config: ConfigType = {
    leftSideBarType: SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED,
}

const getLayoutConfigs = (actionType: LayoutActionType<string | boolean | null>['type'], value: string | boolean) => {
    switch (actionType) {
        case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
            switch (value) {
                case LayoutWidth.LAYOUT_WIDTH_FLUID:
                    config.leftSideBarType = SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
                    break
                case LayoutWidth.LAYOUT_WIDTH_BOXED:
                    config.leftSideBarType = SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
                    break
                default:
                    return config
            }
            break
        default:
            return config
    }
    return config
}

const changeBodyAttribute = (attribute: string, value: string): void => {
    if (document.body) document.body.setAttribute(attribute, value)
}

const changeRootAttribute = (attribute: string, value: string): void => {
  const divRoot = document.getElementById('root')
  divRoot && divRoot.setAttribute(attribute, value)
  if (divRoot) {
    if (value === 'open') {
        divRoot.classList.add('open-modal') 
    } else {
        divRoot.classList.remove('open-modal')
    }
  }
}

const changeClassListAttributeById = (id: string, value: string, type: 'add' | 'remove'): void => {
    const element = document.getElementById(id)
    type === 'add' && element && element.classList.add(value)
    type === 'remove' && element && element.classList.remove(value)
}

const removeFocusableOnElement = () => {
    const rootEl = document.getElementById('root')
    rootEl && rootEl.querySelectorAll('input').forEach((e) => {
        e.setAttribute('tabindex', '-1')
    })
    rootEl &&
      rootEl.querySelectorAll('button').forEach((e) => {
        e.setAttribute('tabindex', '-1')
      })
    rootEl &&
      rootEl.querySelectorAll('a').forEach((e) => {
        e.setAttribute('tabindex', '-1')
      })
    const simpleBar = document.getElementsByClassName('simplebar-content-wrapper')[0]
    simpleBar && simpleBar.setAttribute('tabindex', '-1')
}

const resetForcusableOnElement = () => {
    const rootEl = document.getElementById('root')
    rootEl && rootEl.querySelectorAll('input').forEach((e) => {
      e.removeAttribute('tabindex')
    })
    rootEl &&
      rootEl.querySelectorAll('button').forEach((e) => {
        e.removeAttribute('tabindex')
      })
    rootEl &&
      rootEl.querySelectorAll('a').forEach((e) => {
        e.removeAttribute('tabindex')
      })
    const simpleBar = document.getElementsByClassName(
      'simplebar-content-wrapper'
    )[0]
    simpleBar && simpleBar.removeAttribute('tabindex')
}

export {
  getLayoutConfigs,
  changeBodyAttribute,
  changeRootAttribute,
  changeClassListAttributeById,
  removeFocusableOnElement,
  resetForcusableOnElement,
}
