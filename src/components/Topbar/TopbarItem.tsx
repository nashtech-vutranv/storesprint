import {FC} from 'react'

interface ITopbarItem {
  liClassName: string
  buttonClassName: string
  iconClassName: string
}

const TopbarItem: FC<ITopbarItem> = (props) => {
  const {liClassName, iconClassName, buttonClassName} = props

  return (
    <li className={liClassName}>
      <button className={buttonClassName}>
        <i className={iconClassName}></i>
      </button>
    </li>
  )
}

export default TopbarItem
