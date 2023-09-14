import {
  LayoutTypes,
  LayoutColor,
  LayoutWidth,
  SideBarTheme,
  SideBarWidth,
} from '../../constants'
import {getLayoutConfigs} from '../../utils'
import {LayoutActionType, LayoutActionTypes, LayoutStateType} from '../actions'
import {
  getLayoutColorFromLocal,
  getLeftSideBarThemeFromLocal,
  getLeftSideBarTypeFromLocal,
  storeLayoutColorToLocal,
  storeLeftSideBarThemeToLocal,
  storeLeftSideBarTypeToLocal,
} from '../../helpers/localstorage'

const layoutInitState: LayoutStateType = {
  layoutColor: getLayoutColorFromLocal(LayoutColor.LAYOUT_COLOR_DARK),
  layoutType: LayoutTypes.LAYOUT_VERTICAL,
  layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID,
  leftSideBarTheme: getLeftSideBarThemeFromLocal(
    SideBarTheme.LEFT_SIDEBAR_THEME_DARK
  ),
  leftSideBarType: getLeftSideBarTypeFromLocal(
    SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
  ),
  showRightSidebar: false,
}

const layoutReducer = (
  state: LayoutStateType,
  action: LayoutActionType<any>
) => {
  switch (action.type) {
    case LayoutActionTypes.CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      }
    case LayoutActionTypes.CHANGE_LAYOUT_COLOR:
      storeLayoutColorToLocal(action.payload)
      return {
        ...state,
        layoutColor: action.payload,
      }
    case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidth: action.payload,
        ...getLayoutConfigs(action.type, action.payload!),
      }
    case LayoutActionTypes.CHANGE_SIDEBAR_THEME:
      storeLeftSideBarThemeToLocal(action.payload)
      return {
        ...state,
        leftSideBarTheme: action.payload,
      }
    case LayoutActionTypes.CHANGE_SIDEBAR_TYPE:
      storeLeftSideBarTypeToLocal(action.payload)
      return {
        ...state,
        leftSideBarType: action.payload,
      }
    case LayoutActionTypes.SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: true,
      }
    case LayoutActionTypes.HIDE_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: false,
      }
    default:
      return state
  }
}

export {layoutInitState, layoutReducer}
