import React, {Suspense, useCallback, useContext, useEffect} from 'react'
import {Container} from 'react-bootstrap'
import {Outlet} from 'react-router-dom'
import {changeSidebarType} from '../store/actions'
import * as layoutConstants from '../constants'
import {useViewport, useToggle} from '../hooks'
import {changeBodyAttribute} from '../utils'
import {GlobalContext} from '../store/GlobalContext'

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('./Topbar'))
const LeftSidebar = React.lazy(() => import('./LeftSidebar'))
const Footer = React.lazy(() => import('./Footer'))
const RightSidebar = React.lazy(() => import('./RightSidebar'))

const loading = () => <div className='text-center'></div>

const DetachedLayout = () => {
  const {width} = useViewport()
  const [isMenuOpened, toggleMenu] = useToggle()

  const {
    state: {
      layout: {layoutColor, leftSideBarTheme, leftSideBarType},
    },
    dispatch: {layout: layoutDispatch},
  } = useContext(GlobalContext)

  useEffect(() => {
    changeBodyAttribute(
      'data-layout',
      layoutConstants.LayoutTypes.LAYOUT_DETACHED
    )
    changeBodyAttribute(
      'data-layout-mode',
      layoutConstants.LayoutWidth.LAYOUT_WIDTH_FLUID
    )
    changeBodyAttribute(
      'data-leftbar-theme',
      layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DARK
    )
  }, [])

  useEffect(() => {
    changeBodyAttribute('data-layout-color', layoutColor)
  }, [layoutColor])

  useEffect(() => {
    changeBodyAttribute('data-leftbar-compact-mode', leftSideBarType)
  }, [leftSideBarType])

  /**
   * Open the menu when having mobile screen
   */
  const openMenu = () => {
    toggleMenu()
    if (document.body) {
      if (isMenuOpened) {
        document.body.classList.add('sidebar-enable')
      } else {
        document.body.classList.remove('sidebar-enable')
      }
    }
  }

  const updateDimensions = useCallback(() => {
    // activate the condensed sidebar if smaller devices like ipad or tablet
    if (width >= 768 && width <= 1028) {
      layoutDispatch(
        changeSidebarType(
          layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
        )
      )
    } else if (width > 1028) {
      layoutDispatch(
        changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED)
      )
    }
  }, [layoutDispatch, width])

  useEffect(() => {
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [layoutDispatch, updateDimensions])

  const isCondensed =
    leftSideBarType === layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
  const isLight =
    leftSideBarTheme === layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT

  return (
    <>
      <Suspense fallback={loading()}>
        <Topbar
          openLeftMenuCallBack={openMenu}
          navCssClasses='topnav-navbar topnav-navbar-dark'
          topbarDark={true}
        />
      </Suspense>
      <Container fluid>
        <div className='wrapper'>
          <Suspense fallback={loading()}>
            <LeftSidebar
              isCondensed={isCondensed}
              isLight={isLight}
              hideLogo={true}
              hideUserProfile={false}
            />
          </Suspense>

          <div className='content-page'>
            <div className='content'>
              <Outlet />
            </div>

            <Suspense fallback={loading()}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </Container>
      <Suspense fallback={loading()}>
        <RightSidebar />
      </Suspense>
    </>
  )
}

export default DetachedLayout
