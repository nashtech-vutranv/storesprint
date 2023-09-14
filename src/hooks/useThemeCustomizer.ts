import {useState, useEffect, useCallback, useContext} from 'react'
import {
    changeLayout,
    changeLayoutColor,
    changeLayoutWidth,
    changeSidebarTheme,
    changeSidebarType,
} from '../store/actions'
import * as LayoutConstants from '../constants'
import {GlobalContext} from '../store/GlobalContext'

export default function useThemeCustomizer() {
    const {
        state: {layout: {layoutColor, layoutType, layoutWidth, leftSideBarType, leftSideBarTheme}},
        dispatch: {layout: layoutDispatch},
    } = useContext(GlobalContext)

    const [disableLayoutWidth, setDisableLayoutWidth] = useState<boolean>(false)
    const [disableSidebarTheme, setDisableSidebarTheme] = useState<boolean>(false)
    const [disableSidebarType, setDisableSidebarType] = useState<boolean>(false)

    /**
     * change state based on props changes
     */
    const loadStateFromProps = useCallback(() => {
        setDisableLayoutWidth(
            layoutType !== LayoutConstants.LayoutTypes.LAYOUT_DETACHED &&
            layoutType !== LayoutConstants.LayoutTypes.LAYOUT_FULL
        )

        setDisableSidebarTheme(
            layoutType !== LayoutConstants.LayoutTypes.LAYOUT_HORIZONTAL &&
            layoutType !== LayoutConstants.LayoutTypes.LAYOUT_DETACHED
        )
        setDisableSidebarType(layoutType !== LayoutConstants.LayoutTypes.LAYOUT_HORIZONTAL)
    }, [layoutType])

    useEffect(() => {
        loadStateFromProps()
    }, [loadStateFromProps])

    /**
     * On layout change
     */
    const changeLayoutType = (value: string) => {
        let layout = value
        switch (layout) {
            case 'topnav':
                layoutDispatch(changeLayout(LayoutConstants.LayoutTypes.LAYOUT_HORIZONTAL))
                break
            case 'detached':
                layoutDispatch(changeLayout(LayoutConstants.LayoutTypes.LAYOUT_DETACHED))
                break
            case 'full':
                layoutDispatch(changeLayout(LayoutConstants.LayoutTypes.LAYOUT_FULL))
                break
            default:
                layoutDispatch(changeLayout(LayoutConstants.LayoutTypes.LAYOUT_VERTICAL))
                break
        }
    }

    /**
     * Change the layout color
     */
    const changeLayoutColorScheme = (value: string) => {
        let mode = value
        switch (mode) {
            case 'dark':
                layoutDispatch(changeLayoutColor(LayoutConstants.LayoutColor.LAYOUT_COLOR_DARK))
                break
            default:
                layoutDispatch(changeLayoutColor(LayoutConstants.LayoutColor.LAYOUT_COLOR_LIGHT))
                break
        }
    }

    /**
     * Change the width mode
     */
    const changeWidthMode = (value: string) => {
        let mode = value

        switch (mode) {
            case 'boxed':
                layoutDispatch(changeLayoutWidth(LayoutConstants.LayoutWidth.LAYOUT_WIDTH_BOXED))
                break
            default:
                layoutDispatch(changeLayoutWidth(LayoutConstants.LayoutWidth.LAYOUT_WIDTH_FLUID))
                break
        }
    }

    /**
     * Changes the theme
     */
    const changeLeftSidebarTheme = (value: string) => {
        let theme = value
        switch (theme) {
            case 'default':
                layoutDispatch(changeSidebarTheme(LayoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DEFAULT))
                break
            case 'light':
                layoutDispatch(changeSidebarTheme(LayoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT))
                break
            default:
                layoutDispatch(changeSidebarTheme(LayoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DARK))
                break
        }
    }

    /**
     * Change the leftsiderbar type
     */
    const changeLeftSiderbarType = (value: string) => {
        let type = value
        switch (type) {
            case 'condensed':
                layoutDispatch(changeSidebarType(LayoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED))
                break
            case 'scrollable':
                layoutDispatch(changeSidebarType(LayoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_SCROLLABLE))
                break
            default:
                layoutDispatch(changeSidebarType(LayoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED))
                break
        }
    }

    /**
     * Reset everything
     */
    const reset = () => {
        changeLayoutType(LayoutConstants.LayoutTypes.LAYOUT_VERTICAL)
        changeLayoutColorScheme(LayoutConstants.LayoutColor.LAYOUT_COLOR_LIGHT)
        changeWidthMode(LayoutConstants.LayoutWidth.LAYOUT_WIDTH_FLUID)
        changeLeftSidebarTheme(LayoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_DEFAULT)
        changeLeftSiderbarType(LayoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED)
    }

    return {
        layoutColor,
        layoutType,
        layoutWidth,
        leftSideBarType,
        leftSideBarTheme,
        disableLayoutWidth,
        disableSidebarTheme,
        disableSidebarType,
        changeLayoutType,
        changeLayoutColorScheme,
        changeWidthMode,
        changeLeftSidebarTheme,
        changeLeftSiderbarType,
        reset,
    }
}
