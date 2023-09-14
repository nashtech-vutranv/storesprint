import React, {useEffect, useRef} from 'react'
import * as ReactDom from 'react-dom'
import {Link} from 'react-router-dom'
import {Collapse} from 'react-bootstrap'
import classNames from 'classnames'
import {SubMenus} from './types'
import MenuItem from './MenuItem'

const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu,
  onExpandStatus,
  open,
  idx
}: SubMenus) => {
  const ref = useRef<any>()

  const toggleMenuItem = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (idx || idx === 0) {
      onExpandStatus && onExpandStatus(idx)
    }

    if (toggleMenu) {
      toggleMenu(item, !open)
    }

    return false
  }

  useEffect(() => {
    const menuAppItem = ReactDom.findDOMNode(ref.current) as any
    if (menuAppItem) {
      menuAppItem.setAttribute(
        'aria-label',
        menuAppItem.getAttribute('data-menu-key')
      )
    }
  }, [ref])

  return (
    <li className={classNames('side-nav-item', {'menuitem-active': open})}>
      <Link
        ref={ref}
        to='#'
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={classNames('has-arrow', 'side-sub-nav-link', linkClassName, {
          'menuitem-active': activeMenuItems!.includes(item.key)
            ? 'active'
            : '',
        })}
      >
        {item.icon && <i className={item.icon}></i>}
        {!item.badge ? (
          <span className='menu-arrow'></span>
        ) : (
          <span
            className={classNames(
              'badge',
              'bg-' + item.badge.variant,
              'float-end',
              {
                'text-dark': item.badge.variant === 'light',
              }
            )}
          >
            {item.badge.text}
          </span>
        )}
        <span> {item.label} </span>
      </Link>
      <Collapse in={open}>
        <ul className={classNames(subMenuClassNames)}>
          {(item.children || []).map((child, index) => {
            return (
              <React.Fragment key={index.toString()}>
                {child.children && (
                  <>
                    {/* parent */}
                    <MenuItemWithChildren
                      item={child}
                      linkClassName={
                        activeMenuItems!.includes(child.key) ? 'active' : ''
                      }
                      activeMenuItems={activeMenuItems}
                      subMenuClassNames='side-nav-third-level'
                      toggleMenu={toggleMenu}
                    />
                  </>
                )}
                {!child.children && (
                  <>
                    {/* child */}
                    <MenuItem
                      item={child}
                      className={
                        activeMenuItems!.includes(child.key)
                          ? 'menuitem-active'
                          : ''
                      }
                    />
                  </>
                )}
              </React.Fragment>
            )
          })}
        </ul>
      </Collapse>
    </li>
  )
}

export default MenuItemWithChildren
