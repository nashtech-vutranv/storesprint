import {FC} from 'react'
import classNames from 'classnames'
import {Trans} from 'react-i18next'

const DialogTemplate: FC<{isError?: boolean}> = ({isError}) => {
  return (
    <div
      className={classNames('p-dialog-header justify-content-center', {
        'error-modal': isError,
        'p-1': isError,
      })}
    >
      <div className='p-dialog-title d-flex justify-content-center ps-3'>
        {!isError && (
          <span className='p-confirm-dialog-icon pi pi-exclamation-triangle me-2'></span>
        )}
        {isError && <i className='dripicons-wrong me-2'></i>}
        <span className='p-dialog-title' style={{flexGrow: 'initial'}}>
          {!isError ? (
            <Trans i18nKey={'common_warning_label'}></Trans>
          ) : (
            <Trans i18nKey={'common_error_label'}></Trans>
          )}
        </span>
      </div>
    </div>
  )
}

export default DialogTemplate
