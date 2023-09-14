import {ReactElement, useContext} from 'react'
import {GlobalContext} from '../store/GlobalContext'
import {PermissionDenied} from '../pages/PermissionDenied'

interface IPrivateRouteProps {
  children: ReactElement
  permissions?: string[]
}

export default function PrivateRoute({
  children,
  permissions = [],
}: IPrivateRouteProps) {
  const {
    state: {
      permissionInformations: {permissionCodes},
    },
  } = useContext(GlobalContext)

  // const isHasPermission = permissionCodes.some((permission: string) => {
  //   return permissions.includes(permission)
  // })
  const isHasPermission = permissions.every((permission: string) => {
    return permissionCodes.includes(permission)
  })

  if (isHasPermission) {
    return children
  }

  return <PermissionDenied />
}
