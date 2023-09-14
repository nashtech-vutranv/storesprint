import React, {createContext, useRef} from 'react'
import {Toast} from 'primereact/toast'
import {ConfirmDialog} from 'primereact/confirmdialog'

export interface IToastContext {
  toast?: React.MutableRefObject<any>
}

const initialState: IToastContext = {
  toast: undefined,
}

export const ToastContext = createContext<IToastContext>(initialState)
ToastContext.displayName = 'ToastContext'

export interface IToastProvider {
  children: React.ReactNode
}

export function ToastProvider({children}: IToastProvider) {
  const toastRef = useRef<any>()

  return (
    <ToastContext.Provider
      value={{
        toast: toastRef,
      }}
    >
      <Toast ref={toastRef} position='top-right' />
      <ConfirmDialog />
      {children}
    </ToastContext.Provider>
  )
}
