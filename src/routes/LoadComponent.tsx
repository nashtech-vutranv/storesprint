import {Suspense, useContext} from 'react'
import {GlobalContext} from '../store/GlobalContext'
import PrivateRoute from './PrivateRoute'

type LoadComponentProps = {
  component: React.LazyExoticComponent<() => JSX.Element>
  permissions?: string[]
  isPublic?: boolean
}

const loading = () => <div className=''></div>

const LoadComponent = ({
  component: Component,
  permissions,
  isPublic = false,
}: LoadComponentProps) => {
  const {state: {
    permissionInformations: {isLoadingPermission}
  }} = useContext(GlobalContext)
  if ([null, true].some(x => x === isLoadingPermission)) {
    // Wait for get permissions complete.
    return loading()
  }
  return (
    <Suspense fallback={loading()}>
      {!isPublic ? (
        <PrivateRoute permissions={permissions}>
          <Component />
        </PrivateRoute>
      ) : (
        <Component />
      )}
    </Suspense>
  )
}
export default LoadComponent
