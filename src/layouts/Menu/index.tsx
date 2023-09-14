import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import {useLocation} from 'react-router-dom'
import {findAllParent, findMenuItem} from '../../helpers'
import {MenuItemType} from '../../interface'
import MenuItem from './MenuItem'
import MenuItemWithChildren from './MenuItemWithChildren'

type AppMenuProps = {
  menuItems: Array<MenuItemType>
}

const renderMenuItemChildren = (
  item: MenuItemType,
  expandStatus: boolean[],
  index: number,
  status: {
    onExpandStatus: ((index: number) => void) | undefined
    setOrderExpandStatus?: Dispatch<SetStateAction<boolean>>
    orderExpandStatus?: boolean
    setExpandStatus?: Dispatch<SetStateAction<boolean[]>>
  },
  toggleMenu?: (menuItem: MenuItemType, show: boolean) => void,
  activeMenuItems?: string[] | undefined
) => {
  if (item.children) {
    return (
      <MenuItemWithChildren
        item={item}
        toggleMenu={toggleMenu}
        subMenuClassNames='side-nav-second-level'
        activeMenuItems={activeMenuItems}
        linkClassName='side-nav-link'
        onExpandStatus={status.onExpandStatus}
        idx={index}
        open={expandStatus[index]}
        setExpandStatus={status.setExpandStatus}
      />
    )
  }
  return (
    <MenuItem
      item={item}
      linkClassName='side-nav-link'
      className={
        activeMenuItems && activeMenuItems.includes(item.key)
          ? 'menuitem-active'
          : ''
      }
    />
  )
}

const AppMenu = ({menuItems}: AppMenuProps) => {
  let location = useLocation()
  const oldMenuItemsRef = useRef(menuItems.length)
  const menuRef = useRef<HTMLUListElement>(null)

  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([])

  const [expandStatus, setExpandStatus] = useState<boolean[]>(
    menuItems.map((_: MenuItemType) => false)
  )

  const [orderExpandStatus, setOrderExpandStatus] = useState<boolean>(false)

  const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
    if (show) {
      setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)])
    }
  }

  const activeMenu = useCallback(() => {
    const div = document.getElementById('main-side-menu')
    let matchingMenuItem = null

    if (div) {
      let items: HTMLCollectionOf<HTMLAnchorElement> =
        div.getElementsByClassName(
          'side-nav-link-ref'
        ) as HTMLCollectionOf<HTMLAnchorElement>
      for (let i = 0; i < items.length; ++i) {
        if (location.pathname === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key')
        const activeMt = findMenuItem(menuItems, mid!)
        if (activeMt) {
          setActiveMenuItems([
            activeMt.key,
            ...findAllParent(menuItems, activeMt),
          ])
        }
      }
    }
  }, [location.pathname, menuItems])

  const onExpandStatus = (index: number) => {
    const newExpandStatus = expandStatus.map((status, i) =>
      i === index ? !status : status
    )
    if (newExpandStatus[index] === true) {
      setExpandStatus(
        newExpandStatus.map((_, j) => (j !== index ? false : true))
      )
      return
    }
    setExpandStatus(newExpandStatus)
  }

  useEffect(() => {
    if (
      menuItems.length !== 0 &&
      oldMenuItemsRef.current !== menuItems.length
    ) {
      oldMenuItemsRef.current = menuItems.length
      setExpandStatus(menuItems.map((_: MenuItemType) => false))
    }
  }, [menuItems])

  useEffect(() => {
    activeMenu()
  }, [activeMenu])

  return (
    <ul className='side-nav' ref={menuRef} id='main-side-menu'>
      {(menuItems || []).map((item, index) => {
        const statuses = {
          onExpandStatus,
          setOrderExpandStatus,
          orderExpandStatus,
          setExpandStatus,
        }
        return (
          <React.Fragment key={index.toString()}>
            {item.isTitle && (
              <li className='side-nav-title side-nav-item'>{item.label}</li>
            )}
            {!item.isTitle &&
              renderMenuItemChildren(
                item,
                expandStatus,
                index,
                statuses,
                toggleMenu,
                activeMenuItems
              )}
          </React.Fragment>
        )
      })}
    </ul>
  )
}

export default AppMenu
