import {AxiosError} from 'axios'
import {useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {
  BAD_GATEWAY_ERROR,
  BAD_REQUEST_ERROR,
  FORBIDDEN_ERROR,
  GATEWAY_TIMEOUT_ERROR,
  HTTP_VERSION_NOT_SUPPORTED_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  UNAUTHORIZED_ERROR,
} from '../constants'
import {removeKeyCloakFromLocal} from '../helpers/localstorage'
import {ToastContext} from '../providers'
import {GlobalContext} from '../store/GlobalContext'

const error5xx = [
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED_ERROR,
  BAD_GATEWAY_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  GATEWAY_TIMEOUT_ERROR,
  HTTP_VERSION_NOT_SUPPORTED_ERROR,
]

// const handle5xxErrorWithConfirmDialog = (_err: any) => {
//   confirmDialog({
//     message: (
//       <Trans
//         i18nKey={'common_error_something_went_wrong'}
//         values={{statusCode: _err.response.status}}
//       ></Trans>
//     ),
//     header: <DialogTemplate isError />,
//     acceptClassName: 'btn btn-danger me-0',
//     rejectClassName: 'icon-hide',
//     acceptLabel: 'Cancel',
//     position: 'top',
//     contentClassName: 'pb-2 justify-content-center',
//     accept: () => {},
//   })
//   return
// }

export default function useHandleError() {
  const {
    state: {auth: keycloakValue},
  } = useContext(GlobalContext)

  const {toast} = useContext(ToastContext)

  const {t} = useTranslation()

  const handleErrorUnAuthorization = (_status: number) => {
    if (_status === UNAUTHORIZED_ERROR) {
      removeKeyCloakFromLocal()
      if (keycloakValue) keycloakValue.logout()
      return
    } 
  }

  const handleErrorPermissionWithToast = (_status: number) => {
    if (_status === FORBIDDEN_ERROR) {
      toast?.current?.show({
        severity: 'error',
        summary: t('toast_fail_title'),
        detail: t('toast_fail_forbidden_permission_message'),
        life: 5000,
      })
      return
    }
  }

  const handleError5xxWithToast = (_status: number) => {
    if (error5xx.includes(_status)) {
      toast?.current?.show({
        severity: 'error',
        summary: t('toast_fail_title'),
        detail: `${_status} - ${t('common_error_something_went_wrong')}`,
        life: 5000,
      })
      return
    }
  }

  const handleErrorBadRequest = (
    _error: any,
    _cbErrorFunc?: (param?: any) => void
  ) => {
    if (
      _error.response.status === BAD_REQUEST_ERROR &&
      _error.response.data.errorCode
    ) {
      if (_error.response.data.errorCode === 'VERSION_NOT_MATCH') {
        _cbErrorFunc &&_cbErrorFunc()
      }
      if (
        _error.response.data.errorCode ===
          'DUPLICATE_MMS_VALUE_AND_MARKETPLACE_TYPE' ||
        _error.response.data.errorCode ===
          'DUPLICATE_PRODUCT_PROPERTY_MAPPING' ||
        _error.response.data.errorCode ===
          'DUPLICATE_PRODUCT_PROPERTY_AND_PROPERTY_VALUE_MAPPING'
      ) {
        _cbErrorFunc && _cbErrorFunc(_error)
      }
      return
    }
  }

  const handleErrorResponse = (
    error: AxiosError,
    cbErrorFunc?: (param?: any) => void
  ) => {
    if (error && error.response) {
      const {status} = error.response
      handleErrorUnAuthorization(status)
      handleError5xxWithToast(status)
      handleErrorPermissionWithToast(status)
      handleErrorBadRequest(error, cbErrorFunc)
    }
  }

  return {
    handleErrorResponse,
    handleErrorPermissionWithToast,
  }
}
