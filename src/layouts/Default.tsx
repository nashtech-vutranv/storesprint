import {Suspense, useContext, useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {changeBodyAttribute} from '../utils'
import {GlobalContext} from '../store/GlobalContext'

const loading = () => <div className=''></div>

const DefaultLayout = () => {
  const {
    state: {
      layout: {layoutColor},
    },
  } = useContext(GlobalContext)

  useEffect(() => {
    changeBodyAttribute('data-layout-color', layoutColor)
  }, [layoutColor])

  return (
    <Suspense fallback={loading()}>
      <Outlet />
    </Suspense>
  )
}
export default DefaultLayout
