/* eslint-disable react-hooks/exhaustive-deps */
import {confirmDialog} from 'primereact/confirmdialog'
import {useCallback, useEffect, useState, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation, useNavigate} from 'react-router-dom'
import DialogTemplate from '../components/DialogTemplate'
import {ModalActionTypes} from '../store/actions'
import {GlobalContext} from '../store/GlobalContext'
import {useBlocker} from './'

export const useCallbackPrompt = (when: boolean, state?: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [lastLocation, setLastLocation] = useState(null as any)
  const [confirmedNavigation, setConfirmedNavigation] = useState(false)
  const {t} = useTranslation()
  const {
    dispatch: {modal: modalDispatch},
  } = useContext(GlobalContext)

  const handleBlockedNavigation = useCallback(
    (nextLocation: any) => {
      if (!confirmedNavigation && nextLocation.location.pathname !== location.pathname) {
        modalDispatch({type: ModalActionTypes.OPEN_MODAL})
        setLastLocation(nextLocation)
        confirmDialog({
          message: t('form_confirm_leave_message'),
          header: <DialogTemplate />,
          rejectClassName: 'btn btn-danger',
          acceptClassName: 'btn btn-success mr-0',
          position: 'top',
          closable: false,
          accept: () => {
            modalDispatch({type: ModalActionTypes.CLOSE_MODAL})
            setConfirmedNavigation(true)
          },
          reject: () => modalDispatch({type: ModalActionTypes.CLOSE_MODAL}),
        })
        return false
      }
      return true
    }, [confirmedNavigation, location]
  )

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      if (state && state.viewlistLocation &&
        state.viewlistLocation.search) {
          navigate(
            `${state.viewlistLocation.pathname}${state.viewlistLocation.search}`
          , {state})
          setConfirmedNavigation(false)
        }
      else {
        navigate(lastLocation.location.pathname, {state})
      }
    }
  }, [confirmedNavigation, lastLocation])

  useBlocker(handleBlockedNavigation, when)
}
