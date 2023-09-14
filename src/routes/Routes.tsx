import {useEffect, useContext} from 'react'
import {GlobalContext} from '../store/GlobalContext'
import UserService from '../services/UserService'
import {RowTableActionType, LayoutActionTypes} from '../store/actions'
import {initPageStoreObject, navigateInitialState} from '../store/reducers'
import {AllRoutes} from './index'

const Routes = () => {
  const {
    state: {layout, rowTable, axiosClient, localStorageVer},
    dispatch: {rowTable: rowTableDispatch, layout: layoutDispatch},
  } = useContext(GlobalContext)

  const handleUpdateStoredData = () => {
    localStorage.setItem('version', JSON.stringify(localStorageVer))
    localStorage.setItem('pagesInfo', JSON.stringify(initPageStoreObject))
    localStorage.setItem('currentPage', JSON.stringify(navigateInitialState))
  }

  useEffect(() => {
    new UserService(axiosClient)
      .getCurrentUserSetting()
      .then((response: any) => {
        if (response.data && response.data.setting) {
          const setting = response.data.setting
          rowTableDispatch({
            type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
            payload: setting.rowTable,
          })
          layoutDispatch({
            type: LayoutActionTypes.CHANGE_LAYOUT_COLOR,
            payload: setting.layoutColor,
          })
          layoutDispatch({
            type: LayoutActionTypes.CHANGE_SIDEBAR_THEME,
            payload: setting.leftSideBarTheme,
          })
          layoutDispatch({
            type: LayoutActionTypes.CHANGE_SIDEBAR_TYPE,
            payload: setting.leftSideBarType,
          })
        }
      })
  }, [])

  useEffect(() => {
    new UserService(axiosClient).updateCurrentUserSetting({
      rowTable,
      layoutColor: layout.layoutColor,
      leftSideBarTheme: layout.leftSideBarTheme,
      leftSideBarType: layout.leftSideBarType,
    })
  }, [
    rowTable,
    layout.layoutColor,
    layout.leftSideBarTheme,
    layout.leftSideBarType,
  ])

  useEffect(() => {
    if (localStorage.getItem('version')) {
      const version = Number(JSON.parse(localStorage.getItem('version') as any))
      if (version === localStorageVer) return
      else {
        handleUpdateStoredData()
      }
    } else {
      handleUpdateStoredData()
    }
  }, [localStorageVer])

  return <AllRoutes />
}

export default Routes
