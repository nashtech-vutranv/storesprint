import {useTranslation} from 'react-i18next'

export default function PermissionDenied() {
  const {t} = useTranslation()
  return <div>{t('common_error_permission_denied')}</div>
}
