import {Dispatch, SetStateAction} from 'react'
import {MenuItemType} from '../../interface'

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassNames?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
  open?: boolean
  idx?: number
  onExpandStatus?: (index: number) => void
  setExpandStatus?: Dispatch<SetStateAction<boolean[]>>
}
