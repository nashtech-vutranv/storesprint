import '../src/assets/scss/primereact/themes/lara-dark-blue.scss'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '../src/assets/scss/Saas.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
