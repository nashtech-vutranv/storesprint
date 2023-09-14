import {useLayoutEffect} from 'react'

export const useCommonAccesibility = (_values?: any) => {
  useLayoutEffect(() => {
    const dropdownTriggerEl = document.getElementsByClassName(
      'p-dropdown-trigger'
    )[0] as any

    const endBarToggleEl = document.getElementsByClassName(
      'end-bar-toggle float-end'
    )[0] as any

    if (dropdownTriggerEl) {
      dropdownTriggerEl.setAttribute('aria-label', 'dropdown-trigger')
    }

    if (endBarToggleEl) {
      endBarToggleEl.setAttribute('aria-label', 'endbar-toggle')
    }

    document.querySelectorAll('[role="combobox"]').forEach((el) => {
      el.setAttribute('aria-label', 'combobox')
    })

    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('role')
      el.removeAttribute('aria-label')
      el.removeAttribute('aria-checked')
      el.removeAttribute('checked')
    })

    document.querySelectorAll('[role="switch"]').forEach((el) => {
      el.setAttribute('aria-label', 'switch')
    })

    document.querySelectorAll('input[type=text]').forEach((el) => {
      el.setAttribute('aria-label', 'textbox')
    })

    document.querySelectorAll('.p-inputtext').forEach((el) => {
      if (el.hasAttribute('disabled')) {
        el.setAttribute('aria-label', 'disabled')
      }
    })

    document.querySelectorAll('input[type=checkbox]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
      el.removeAttribute('role')
    })
  }, [])
}

export const useSwitchAccesibility = (values: any) => {
  useLayoutEffect(() => {
    document.querySelectorAll('input[type=checkbox]').forEach((el) => {
      el.setAttribute('aria-label', 'input-checkbox')
    })

    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('aria-checked')
    })

    document.querySelectorAll('[role="checkbox"]').forEach((el) => {
      el.removeAttribute('role')
    })
  }, [values.status])
}

