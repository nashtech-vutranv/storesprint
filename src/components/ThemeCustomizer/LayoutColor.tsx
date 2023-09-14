import {useEffect} from 'react'
import {Form} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import * as LayoutConstants from '../../constants'

type LayoutColorProps = {
  changeLayoutColorScheme: (value: string) => void
  layoutColor: string
  layoutConstants: typeof LayoutConstants.LayoutColor
}

const LayoutColor = ({
  changeLayoutColorScheme,
  layoutColor,
  layoutConstants,
}: LayoutColorProps) => {
  const {t} = useTranslation()

  useEffect(() => {
    document.querySelectorAll('[type="radio"]').forEach((el) => {
      el.setAttribute('aria-label', 'toggle-theme-color')
    })
  }, [])

  return (
    <>
      <h5>{t('layout_color_scheme')}</h5>

      <hr className='mt-1' />

      <Form.Check className='form-check form-switch mb-1'>
        <Form.Check.Input
          type='radio'
          onChange={(e) => changeLayoutColorScheme(e.target.value)}
          name='layout-color'
          value={layoutConstants.LAYOUT_COLOR_LIGHT}
          id='light-mode'
          checked={layoutColor === layoutConstants.LAYOUT_COLOR_LIGHT}
        />
        <Form.Check.Label htmlFor='vertical-layout'>
          {t('layout_color_scheme_light_mode')}
        </Form.Check.Label>
      </Form.Check>

      <Form.Check className='form-check form-switch mb-1'>
        <Form.Check.Input
          type='radio'
          onChange={(e) => changeLayoutColorScheme(e.target.value)}
          name='layout-color'
          value={layoutConstants.LAYOUT_COLOR_DARK}
          id='dark-mode'
          checked={layoutColor === layoutConstants.LAYOUT_COLOR_DARK}
        />
        <Form.Check.Label htmlFor='horizontal-layout'>
          {t('layout_color_scheme_dark_mode')}
        </Form.Check.Label>
      </Form.Check>
    </>
  )
}

export default LayoutColor
