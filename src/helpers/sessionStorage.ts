import {IPreviousPage} from '../interface'

export const storePreviousPageInfoToSession = (
  previousPage: IPreviousPage | null
) => {
  sessionStorage.setItem('previousPage', JSON.stringify(previousPage))
}

export const getPreviousPageInfoFromSession: (
  initialPreviousePageState: IPreviousPage | null
) => IPreviousPage | null = (initialPreviousePageState) => {
  return sessionStorage.getItem('previousPage')
    ? JSON.parse(sessionStorage.getItem('previousPage') as any)
    : initialPreviousePageState
}
