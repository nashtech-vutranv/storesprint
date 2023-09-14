import classNames from 'classnames'
import {useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {GlobalContext} from '../../store/GlobalContext'
import {showRightSidebar} from '../../store/actions'
import {ProfileOption} from '../../layouts/types'
import LanguageDropdown from './LanguageDropdown'
import ProfileDropdown from './ProfileDropdown'

type TopbarProps = {
  hideLogo?: boolean
  navCssClasses?: string
  openLeftMenuCallBack?: () => void
  topbarDark?: boolean
  isCondensed?: boolean
}

const Topbar = ({hideLogo, navCssClasses, isCondensed}: TopbarProps) => {
  const {
    state: {
      auth,
      permissionInformations: {handleChangeAppCode, appCode, hasUpsPermissions},
    },
    dispatch: {layout: layoutDispatch},
  } = useContext(GlobalContext)
  const {t} = useTranslation()

  const containerCssClasses = !hideLogo ? 'container-fluid' : ''

  /**
   * Toggles the right sidebar
   */
  const handleRightSideBar = (e: any) => {
    e.preventDefault()
    layoutDispatch(showRightSidebar())
  }

  const getProfileMenuByAppCode = () => {
    if (appCode === 'mms') {
      if (hasUpsPermissions) {
        return {
          label: 'User permissions',
          icon: 'mdi mdi-account-group',
          onClick: () => {
            handleChangeAppCode('ups')
          },
        }
      }

      return undefined
    }
    return {
      label: 'MMS',
      icon: 'mdi mdi-apps',
      onClick: () => {
        handleChangeAppCode('mms')
      },
    }
  }

  const profileMenus = () => {
    const menuItemByAppCode = getProfileMenuByAppCode()
    const defaultMenuItems: ProfileOption[] = [
      {
        label: t('common_button_logout_label'),
        icon: 'mdi mdi-logout',
        onClick: () => auth?.logout(),
      },
    ]
    if (menuItemByAppCode) {
      defaultMenuItems.unshift(menuItemByAppCode as ProfileOption)
    }

    return defaultMenuItems
  }

  return (
    <div className={classNames('navbar-custom', navCssClasses)}>
      <div className={containerCssClasses}>
        {isCondensed && appCode === 'mms' && (
          <>
            <div className='logo top-title'>
              <span className='logo-lg fs-3'>THG / MMS</span>
              <span className='logo-sm fs-3'>THG / MMS</span>
            </div>
          </>
        )}

        {isCondensed && appCode === 'ups' && (
          <>
            <div className='logo top-title'>
              <span className='logo-lg fs-3'>THG / UPS</span>
              <span className='logo-sm fs-3'>THG / UPS</span>
            </div>
          </>
        )}

        <ul className='list-unstyled topbar-menu float-end mb-0'>
          <li className='notification-list'>
            <button
              aria-label='setting-toggle-btn'
              className='nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none'
              onClick={handleRightSideBar}
            >
              <i className='dripicons-gear noti-icon'></i>
            </button>
          </li>
          <li className='dropdown notification-list topbar-dropdown'>
            <LanguageDropdown />
          </li>
          <li className='dropdown notification-list'>
            <ProfileDropdown
              menuItems={profileMenus()}
              username={auth ? auth.tokenParsed?.name || '' : ''}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Topbar
