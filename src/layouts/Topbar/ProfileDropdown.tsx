import {Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import classNames from 'classnames'
import {useToggle} from '../../hooks'
import {ProfileOption} from '../types'

type ProfileDropdownProps = {
  menuItems: Array<ProfileOption>
  username: string
}

const ProfileDropdown = ({username, menuItems}: ProfileDropdownProps) => {
  const [isOpen, toggleDropdown] = useToggle()

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant='link'
        id='dropdown-profile'
        onClick={toggleDropdown}
        className='nav-link dropdown-toggle nav-user arrow-none me-0 shadow-none'
      >
        <span className='account-user-name'>{username}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        align={'end'}
        className='dropdown-menu-animated topbar-dropdown-menu profile-dropdown'
      >
        <div onClick={toggleDropdown}>
          {menuItems.map((item, i) => {
            return (
              <Link
                to='#'
                className='dropdown-item notify-item'
                key={i + '-profile-menu'}
                onClick={item.onClick}
              >
                <i className={classNames(item.icon, 'me-1')}></i>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ProfileDropdown
