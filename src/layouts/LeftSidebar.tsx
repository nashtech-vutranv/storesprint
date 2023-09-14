import {useContext, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {useToggle, useViewport} from '../hooks'
import {changeSidebarType} from '../store/actions'
import {getMenuItemsByPermissions, translateLabelForMenuItems} from '../helpers'
import * as layoutConstants from '../constants'
import {GlobalContext} from '../store/GlobalContext'
import AppMenu from './Menu/'

type SideBarContentProps = {
  hideUserProfile: boolean
}

const SideBarContent = (_props: SideBarContentProps) => {
  const {t} = useTranslation()
  const {
    state: {
      permissionInformations: {permissions, appCode},
    },
  } = useContext(GlobalContext)
  return (
    <>
      <AppMenu
        menuItems={translateLabelForMenuItems(
          getMenuItemsByPermissions(permissions, appCode),
          t
        )}
      />
      <div className='clearfix' />
    </>
  )
}

type LeftSidebarProps = {
  hideLogo?: boolean
  hideUserProfile: boolean
  isLight: boolean
  isCondensed: boolean
  openLeftMenuCallBack?: () => void
}

const LeftSidebar = ({
  isCondensed,
  hideLogo,
  hideUserProfile,
  openLeftMenuCallBack,
}: LeftSidebarProps) => {
  const {
    state: {
      layout: {layoutType, leftSideBarType},
      permissionInformations: {appCode},
    },
    dispatch: {layout: layoutDispatch},
  } = useContext(GlobalContext)
  const menuNodeRef = useRef<HTMLDivElement>(null)
  const {width} = useViewport()
  const [isMenuOpened, toggleMenu] = useToggle()

  const handleOtherClick = (e: MouseEvent) => {
    if (
      menuNodeRef &&
      menuNodeRef.current &&
      menuNodeRef.current.contains(e.target as Node)
    )
      return
    // else hide the menubar
    if (document.body) {
      document.body.classList.remove('sidebar-enable')
    }
  }

  const handleLeftMenuCallBack = () => {
    toggleMenu()
    if (openLeftMenuCallBack) openLeftMenuCallBack()

    switch (layoutType) {
      case layoutConstants.LayoutTypes.LAYOUT_VERTICAL:
        if (width >= 768) {
          if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable') {
            layoutDispatch(
              changeSidebarType(
                layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
              )
            )
          }
          if (leftSideBarType === 'condensed') {
            layoutDispatch(
              changeSidebarType(
                layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
              )
            )
          }
        }
        break

      case layoutConstants.LayoutTypes.LAYOUT_FULL:
        if (document.body) {
          document.body.classList.toggle('hide-menu')
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOtherClick, false)
    return () => {
      document.removeEventListener('mousedown', handleOtherClick, false)
    }
  }, [])

  return (
    <div className='leftside-menu' ref={menuNodeRef}>
      {!hideLogo &&
        !isCondensed &&
        layoutType === layoutConstants.LayoutTypes.LAYOUT_VERTICAL &&
        appCode === 'mms' && (
          <>
            <div className='logo text-center'>
              <span className='logo-lg fs-3'>THG / MMS</span>
              <span className='logo-sm fs-3'>THG / MMS</span>
            </div>
          </>
        )}

      {!hideLogo &&
        !isCondensed &&
        layoutType === layoutConstants.LayoutTypes.LAYOUT_VERTICAL &&
        appCode === 'ups' && (
          <>
            <div className='logo text-center'>
              <span className='logo-lg fs-3'>THG / UPS</span>
              <span className='logo-sm fs-3'>THG / UPS</span>
            </div>
          </>
        )}

      <span className='menu-toggle'>
        {(layoutType === layoutConstants.LayoutTypes.LAYOUT_VERTICAL ||
          layoutType === layoutConstants.LayoutTypes.LAYOUT_FULL) && (
          <button
            aria-label='toggle-btn'
            className='button-menu-mobile open-left left-bar'
            onClick={handleLeftMenuCallBack}
          >
            <i className='mdi mdi-menu' />
          </button>
        )}

        {layoutType === layoutConstants.LayoutTypes.LAYOUT_HORIZONTAL && (
          <Link
            to='#'
            className={classNames('navbar-toggle', {open: isMenuOpened})}
            onClick={handleLeftMenuCallBack}
          >
            <div className='lines'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Link>
        )}

        {layoutType === layoutConstants.LayoutTypes.LAYOUT_DETACHED && (
          <Link
            to='#'
            className='button-menu-mobile disable-btn'
            onClick={handleLeftMenuCallBack}
          >
            <div className='lines'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Link>
        )}
      </span>

      {!isCondensed && (
        <SimpleBar
          style={{maxHeight: '100%'}}
          timeout={500}
          scrollbarMaxSize={320}
        >
          <SideBarContent hideUserProfile={hideUserProfile} />
        </SimpleBar>
      )}
      {isCondensed && <SideBarContent hideUserProfile={hideUserProfile} />}
    </div>
  )
}

export default LeftSidebar
