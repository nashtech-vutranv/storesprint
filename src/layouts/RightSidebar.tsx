import {useContext, useEffect, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import {ThemeCustomizer} from '../components'
import {GlobalContext} from '../store/GlobalContext'
import {hideRightSidebar} from '../store/actions'

const RightSideBar = () => {
  const rightBarNodeRef = useRef<HTMLDivElement>(null)

  const {
    state: {
      layout: {showRightSidebar},
    },
    dispatch: {layout: layoutDispatch},
  } = useContext(GlobalContext)

  /**
   * Handles the close
   */
  const handleClose = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    layoutDispatch(hideRightSidebar())
  }

  /**
   * Handle the click anywhere in doc
   */
  const handleOtherClick = useCallback(
    (e: any) => {
      if (showRightSidebar) {
        if (
          rightBarNodeRef &&
          rightBarNodeRef.current &&
          rightBarNodeRef.current.contains(e.target)
        ) {
          return
        } else {
          layoutDispatch(hideRightSidebar())
        }
      }
    },
    [rightBarNodeRef, showRightSidebar, layoutDispatch]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleOtherClick, false)
    return () => {
      document.removeEventListener('mousedown', handleOtherClick, false)
    }
  })

  const manageBodyClass = (cssClass: string, action = 'toggle') => {
    switch (action) {
      case 'add':
        if (document.body) document.body.classList.add(cssClass)
        break
      case 'remove':
        if (document.body) document.body.classList.remove(cssClass)
        break
      default:
        if (document.body) document.body.classList.toggle(cssClass)
        break
    }

    return true
  }

  useEffect(() => {
    manageBodyClass('end-bar-enabled', showRightSidebar ? 'add' : 'remove')
  }, [showRightSidebar])

  useEffect(() => {
    const endBarToggleEl = document.getElementsByClassName(
      'end-bar-toggle float-end'
    )[0] as any

    if (endBarToggleEl) {
      endBarToggleEl.setAttribute('aria-label', 'endbar-toggle')
    }
  }, [])

  return (
    <>
      <div className='end-bar' ref={rightBarNodeRef}>
        <div className='rightbar-title'>
          <Link
            to='#'
            className='end-bar-toggle float-end'
            onClick={handleClose}
          >
            <i className='dripicons-cross noti-icon'></i>
          </Link>
          <h5 className='m-0'>Settings</h5>
        </div>

        <SimpleBar
          style={{maxHeight: '100%', zIndex: 10000}}
          timeout={500}
          scrollbarMaxSize={320}
        >
          <div className='rightbar-content h-100'>
            {' '}
            <ThemeCustomizer />
          </div>
        </SimpleBar>
      </div>

      <div className='rightbar-overlay'></div>
    </>
  )
}

export default RightSideBar
