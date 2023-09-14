import {useTranslation} from 'react-i18next'
import {Spinner, SpinnerProps} from '../'

export type LoadingProps = SpinnerProps & {
    label?: string
    subLabel?: string
}

export default function Loading({
  children,
  className = 'p-spinner',
  color = 'primary',
  size,
  tag,
  type,
  label,
  subLabel
}: LoadingProps) {
  const {t} = useTranslation()

  return (
    <div style={{position: 'relative'}}>
      <div className='p-spinner-overlay'></div>
      <div className='p-spinner-container'>
        <Spinner
          tag={tag}
          type={type}
          size={size}
          color={color}
          className={className}
        >
          {children}
        </Spinner>
        <div className='p-spinner-note'>
          <h5 className='p-dialog-title'>
            {label || t('common_loading_message_above')}
          </h5>
          <p>{subLabel || t('common_loading_message_below')}</p>
        </div>
      </div>
    </div>
  )
}
