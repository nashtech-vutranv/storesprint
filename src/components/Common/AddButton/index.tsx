import {useContext} from 'react'
import {Button} from 'react-bootstrap'
import {GlobalContext} from '../../../store/GlobalContext'

interface IAddButtonProps {
  label: string
  onClick?: () => void
  permissions: string[]
  noIconPlus?: boolean
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

export default function AddButton({
  label,
  onClick,
  permissions,
  noIconPlus,
  className,
  children,
  disabled,
}: IAddButtonProps) {
  const {
    state: {
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return checkHasPermissions && checkHasPermissions(permissions || []) ? (
    <Button
      onClick={handleClick}
      type='button'
      variant='success'
      className={className}
      disabled={disabled}
    >
      {children ?? (
        <>
          {!noIconPlus && <i className='pi pi-plus'></i>} <span>{label}</span>
        </>
      )}
    </Button>
  ) : null
}
