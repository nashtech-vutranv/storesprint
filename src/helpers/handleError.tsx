import {SetStateAction} from 'react'
import {AxiosError} from 'axios'
import {KeycloakInstance} from 'keycloak-js'
import {confirmDialog} from 'primereact/confirmdialog'
import DialogTemplate from '../components/DialogTemplate'
import {
  BAD_GATEWAY_ERROR,
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  FORBIDDEN_ERROR,
  GATEWAY_TIMEOUT_ERROR,
  HTTP_VERSION_NOT_SUPPORTED_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  UNAUTHORIZED_ERROR,
} from '../constants'
import {removeKeyCloakFromLocal} from './localstorage'

const error5xx = [
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED_ERROR,
  BAD_GATEWAY_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  GATEWAY_TIMEOUT_ERROR,
  HTTP_VERSION_NOT_SUPPORTED_ERROR,
]
const generalErrMessage = 'Something went wrong'

// const forbiddenDialogMessage = confirmDialog({
//   message: (
//     <Trans
//       i18nKey={'common_error_access_denied'}
//       values={{statusCode: error.response.status}}
//     ></Trans>
//   ),
//   header: <DialogTemplate isError />,
//   acceptClassName: 'btn btn-danger me-0',
//   rejectClassName: 'icon-hide',
//   acceptLabel: 'Cancel',
//   position: 'top',
//   contentClassName: 'pb-2 justify-content-center',
//   accept: () => {
//     // do smth
//   },
// })

export const handleErrorResponse = (
  error: AxiosError,
  keycloakValue: KeycloakInstance | null,
  cbErrorFunc?: (param?: any) => void
) => {
  if (error && error.response) {
    if (error.response.status === UNAUTHORIZED_ERROR) {
      removeKeyCloakFromLocal()
      if (keycloakValue) keycloakValue.logout()
      return
    }

    if (
      error.response.status === BAD_REQUEST_ERROR &&
      error.response.data.errorCode &&
      cbErrorFunc
    ) {
      if (error.response.data.errorCode === 'VERSION_NOT_MATCH') {
        cbErrorFunc()
      }
      if (
        error.response.data.errorCode ===
          'DUPLICATE_MMS_VALUE_AND_MARKETPLACE_TYPE' ||
        error.response.data.errorCode ===
          'DUPLICATE_PRODUCT_PROPERTY_MAPPING' ||
        error.response.data.errorCode ===
          'DUPLICATE_PRODUCT_PROPERTY_AND_PROPERTY_VALUE_MAPPING'
      ) {
        cbErrorFunc(error)
      }
      return
    }

    if (error5xx.includes(error.response.status)) {
      confirmDialog({
        message: `${error.response.status} - ${generalErrMessage}`,
        header: <DialogTemplate isError />,
        acceptClassName: 'btn btn-danger me-0',
        rejectClassName: 'icon-hide',
        acceptLabel: 'Cancel',
        position: 'top',
        contentClassName: 'pb-2 justify-content-center',
        accept: () => {
          // do smth
        },
      })
      return
    }

    if (error.response.status === FORBIDDEN_ERROR) {
      cbErrorFunc && cbErrorFunc()
      return
    }
  }
}

export const handleErrorMessage: (
  handleConflictError: (err: any) => void,
  err: any,
  setInvalidCredentialMessage: (value: SetStateAction<string>) => void,
  invalidCredentialMessage: string,
  setFieldError: (field: string, value: string | undefined) => void,
  fieldErrorMessage: string,
  setLocaleIsNotSupportedMessage: (value: SetStateAction<string>) => void,
  localeIsNotSupportedMessage: string,
  auth: Keycloak.KeycloakInstance | null
) => void = (
  handleConflictError,
  err,
  setInvalidCredentialMessage,
  invalidCredentialMessage,
  setFieldError,
  fieldErrorMessage,
  setLocaleIsNotSupportedMessage,
  localeIsNotSupportedMessage,
  auth
) => {
  if (err.response.data.status === CONFLICT_ERROR) {
    handleConflictError(err)
  }
  if (err.response.data.status === BAD_REQUEST_ERROR) {
    if (err.response.data.message === 'Invalid seller account credentials') {
      setInvalidCredentialMessage(invalidCredentialMessage)
    }
    if (
      err.response.data.message ===
      'This locale is not supported by this marketplace'
    ) {
      setFieldError('siteLocaleId', fieldErrorMessage)
      setLocaleIsNotSupportedMessage(localeIsNotSupportedMessage)
    } else handleErrorResponse(err, auth)
  }
}
