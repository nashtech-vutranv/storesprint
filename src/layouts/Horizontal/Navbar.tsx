import {useContext} from 'react'
import {Collapse} from 'react-bootstrap'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {
  getMenuItemsByPermissions,
  translateLabelForMenuItems,
} from '../../helpers'
import {GlobalContext} from '../../store/GlobalContext'
import AppMenu from './Menu/'

type NavbarProps = {
  isMenuOpened?: boolean
}

const Navbar = ({isMenuOpened}: NavbarProps) => {
  const {t} = useTranslation()
  const inputTheme = 'dark'
  const {
    state: {
      permissionInformations: {permissions, appCode},
    },
  } = useContext(GlobalContext)

  return (
    <div className='topnav shadow-sm'>
      <div className='container-fluid'>
        <nav
          className={classNames(
            'navbar',
            'navbar-expand-lg',
            'topnav-menu',
            'navbar-' + inputTheme
          )}
        >
          <Collapse in={isMenuOpened} className='navbar-collapse'>
            <div id='topnav-menu-content'>
              <AppMenu
                menuItems={translateLabelForMenuItems(
                  getMenuItemsByPermissions(permissions, appCode),
                  t
                )}
              />
            </div>
          </Collapse>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
