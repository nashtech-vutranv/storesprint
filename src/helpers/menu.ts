import {TFunction} from 'i18next'
import {MENU_ITEMS, UPS_MENU_ITEMS} from '../constants'
import {AppCode, IMenuItems, IPermission, MenuItemType} from '../interface'

const findAllParent = (menuItems: IMenuItems[], menuItem: IMenuItems): any => {
  let parents: any = []
  const parent = findMenuItem(menuItems, menuItem.parentKey)

  if (parent) {
    parents.push(parent.key)
    if (parent.key) parents = [...parents, ...findAllParent(menuItems, parent)]
  }
  return parents
}

const findMenuItem = (
  menuItems: IMenuItems[],
  menuItemKey?: string
): IMenuItems | null => {
  if (menuItems && menuItemKey) {
    let result: IMenuItems | null = null
    menuItems.forEach((menuItem: IMenuItems) => {
      if (menuItem.key === menuItemKey) {
        result = menuItem
        return
      }
      const menuItemChild = findMenuItem(menuItem.children, menuItemKey)
      if (menuItemChild) result = menuItemChild
    })
    return result
  }
  return null
}

const getMenuItemsByAppCode = (appCode: AppCode) => {
  let menuItems = [...UPS_MENU_ITEMS]
  if (appCode === 'mms') {
    menuItems = [...MENU_ITEMS]
  }
  return menuItems
}

const getMenuItemsByPermissions = (permissions: IPermission[], appCode: AppCode) => {
  if (permissions.length === 0 || permissions[0].appCode !== appCode) {
    return []
  }
  const codes = permissions.map(x => x.code)
  const menuItems = getMenuItemsByAppCode(appCode)
  const parentItems = menuItems.filter((menuItem: MenuItemType) =>
    menuItem.permissions?.some((permissionCode: string) =>
      codes.includes(permissionCode)
    )
  )
  return parentItems.map((parentItem: MenuItemType) => {
    if (parentItem.children) {
      parentItem.children = parentItem.children?.filter(
        (childrenItem: MenuItemType) =>
          childrenItem.permissions?.some((permissionCode: string) =>
            codes.includes(permissionCode)
          )
      )
    }
    return parentItem
  })
}

const translateLabelForMenuItems = (
  menuItems: MenuItemType[],
  t: TFunction
) => {
  const translatedMenuItems = menuItems.map((x) => {
    let children: MenuItemType[] = []
    if (x.children) {
      children = x.children.map((y) => ({...y, label: t(y.label)}))
    }
    return {
      ...x,
      children,
      label: t(x.label),
    }
  })
  return translatedMenuItems
}

export {
  findAllParent,
  findMenuItem,
  getMenuItemsByPermissions,
  translateLabelForMenuItems,
}
