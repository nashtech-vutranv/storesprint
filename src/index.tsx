import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
// import UpsUiModule from '@thg-harveynash/ups-ui-component'
import './assets/scss/primereact/themes/lara-dark-blue.scss'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App'
import {GlobalContextProvider} from './store/GlobalContext'
import {ToastProvider} from './providers'
import {GlobalConfig} from './global'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
})

fetch(`${window.location.origin}/config.json`)
  .then((res) => res.json())
  .then((data) => {
    GlobalConfig().config = data
    root.render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <GlobalContextProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </GlobalContextProvider>
        </BrowserRouter>
      </QueryClientProvider>)
  })
  .catch((error) => console.log(error))
