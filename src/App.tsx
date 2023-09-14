import {useContext} from 'react'
import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
// import UpsUiModule from '@thg-harveynash/ups-ui-component'
import UpsUiModule from '@thg-harveynash/mms-ups-ui-component'
import RoutesApp from './routes/Routes'
import {GlobalContext} from './store/GlobalContext'
import './assets/scss/Saas.scss'
import './assets/scss/ups-custom.scss'
import {UpsLayout} from './layouts'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    detection: {
      order: [
        'localStorage',
        'cookie',
        'htmlTag',
        'sessionStorage',
        'path',
        'subdomain',
      ],
    },
    backend: {
      allowMultiLoading: true,
      loadPath: '/locales/{{lng}}/translation.json',
    },
    ns: ['translations'],
    defaultNS: 'translations',
  })

const App = () => {
  const {
    state: {
      auth,
      permissionInformations: {appCode, permissions},
    },
  } = useContext(GlobalContext)

  if (auth) {
    if (appCode === 'ups' && permissions && permissions.length) {
      return (
        <UpsLayout>
          <UpsUiModule />
        </UpsLayout>
      )
    } else {
      return <RoutesApp />
    }
  }
  return null
}

export default App
