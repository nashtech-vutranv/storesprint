import {useEffect, useContext} from 'react'
import {GlobalContext} from '../store/GlobalContext'
import {PreviousPageActionType} from '../store/actions'
import {MenuItemKey} from '../interface'

export default function usePreviousPage(
  pageName: MenuItemKey,
  dataContent: any
) {
  const {
    dispatch: {
      previousPage: previousPageDispatch
    }
  } = useContext(GlobalContext)

  useEffect(() => {
    return () => {
      previousPageDispatch({
        type: PreviousPageActionType.GET_CURRENT_PREVIOUS_PAGE_INFORMATION,
        payload: {
          name: pageName,
          data: dataContent,
        },
      })
    }
  }, [])
}
