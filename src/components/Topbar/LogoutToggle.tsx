import {FC, useContext, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Button} from 'primereact/button'
import {GlobalContext} from '../../store/GlobalContext'

const LogoutToggle: FC = () => {
  const [open, setOpen] = useState(false)
  const {
    state: {auth},
  } = useContext(GlobalContext)

  const {t} = useTranslation()

  const onLogout = () => {
    auth?.logout()
    localStorage.removeItem('permissionList')
  }

  return (
    <div
      className='nav-link username-text'
      tabIndex={0}
      onClick={() => {
        setOpen(!open)
      }}
      onBlur={(e) => {
        if (open === true && !e.relatedTarget?.hasAttribute('data-cy')) {
          setOpen(false)
        }
      }}
    >
      <span
        className='notification-list noti-icon'
        style={{
          fontSize: 'var(--bs-body-font-size)',
          cursor: 'pointer',
        }}
      >
        {auth?.tokenParsed?.preferred_username}
      </span>

      {open && (
        <div className='button-logout'>
          <Button
            data-cy='close'
            className='p-button-sm'
            label={t('common_button_logout_label')}
            icon='pi pi-sign-out'
            iconPos='left'
            onClick={onLogout}
          />
        </div>
      )}
    </div>
  )
}

export default LogoutToggle
