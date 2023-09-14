import {useEffect} from 'react'
import {Form} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import * as LayoutConstants from '../../constants'

type LeftSideBarThemeProps = {
  changeLeftSidebarTheme: (value: string) => void
  leftSideBarTheme: string
  layoutConstants: typeof LayoutConstants.SideBarTheme
}

const LeftSideBarTheme = ({
  changeLeftSidebarTheme,
  leftSideBarTheme,
  layoutConstants,
}: LeftSideBarThemeProps) => {
  const {t} = useTranslation()

  useEffect(() => {
    document.querySelectorAll('[type="radio"]').forEach((el) => {
      el.setAttribute('aria-label', 'toggle-left-sidebar-color')
    })
  }, [])

  return (
    <>
      <h5 className='mt-4'>{t('layout_left_side_color')}</h5>
      <hr className='mt-1' />

      <Form.Check className='form-check form-switch mb-1'>
        <Form.Check.Input
          type='radio'
          name='theme'
          id='brand-check'
          value={layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT}
          onChange={(e) => changeLeftSidebarTheme(e.target.value)}
          checked={
            leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT
          }
        />
        <Form.Check.Label htmlFor='brand-check'>
          {t('layout_left_side_color_default')}
        </Form.Check.Label>
      </Form.Check>

      <Form.Check className='form-check form-switch mb-1'>
        <Form.Check.Input
          type='radio'
          name='theme'
          id='light-check'
          value={layoutConstants.LEFT_SIDEBAR_THEME_LIGHT}
          onChange={(e) => changeLeftSidebarTheme(e.target.value)}
          checked={
            leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_LIGHT
          }
        />
        <Form.Check.Label htmlFor='light-check'>
          {t('layout_left_side_color_light')}
        </Form.Check.Label>
      </Form.Check>

      <Form.Check className='form-check form-switch mb-1'>
        <Form.Check.Input
          type='radio'
          name='theme'
          id='dark-check'
          value={layoutConstants.LEFT_SIDEBAR_THEME_DARK}
          onChange={(e) => changeLeftSidebarTheme(e.target.value)}
          checked={leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DARK}
        />
        <Form.Check.Label htmlFor='dark-check'>
          {t('layout_left_side_color_dark')}
        </Form.Check.Label>
      </Form.Check>
    </>
  )
}

export default LeftSideBarTheme
