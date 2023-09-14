import {useContext} from 'react'
import classNames from 'classnames'
import {Link, useLocation} from 'react-router-dom'
import {GlobalContext} from '../../store/GlobalContext'
import {NavigateActionType} from '../../store/actions'
import {MenuItemKey} from '../../interface'
import {SubMenus} from './types'

const MenuItemLink = ({item, className}: SubMenus) => {
  let location = useLocation()
  const {
    dispatch: {currentPage: currentPageDispatch},
  } = useContext(GlobalContext)

  const handleStoreNavigatePageInfo = (pageKey: MenuItemKey) => {
    currentPageDispatch({
      type: NavigateActionType.GET_CURRENT_PAGE_SEO_NAME,
      payload: pageKey,
    })
  }

  return (
    <Link
      to={{pathname: item.url}}
      target={item.target}
      className={classNames(
        'side-nav-link-ref',
        'side-sub-nav-link',
        className,
        {
          active: location && location.pathname === item.url,
        }
      )}
      data-menu-key={item.key}
      onClick={(_e) => handleStoreNavigatePageInfo(item.key)}
    >
      {item.icon && <i className={item.icon}></i>}
      {item.badge && (
        <span
          className={classNames(
            'badge',
            'bg-' + item.badge.variant,
            'rounded',
            'font-10',
            'float-end',
            {
              'text-dark': item.badge.variant === 'light',
              'text-light':
                item.badge.variant === 'dark' ||
                item.badge.variant === 'secondary',
            }
          )}
        >
          {item.badge.text}
        </span>
      )}
      <span> {item.label} </span>
    </Link>
  )
}

export default MenuItemLink
