import {useContext, useEffect} from 'react'
import {UNSAFE_NavigationContext as navigationContext} from 'react-router-dom'
import type {History, Blocker, Transition} from 'history'


export const useBlocker = (blocker: Blocker, when = true) => {
  const navigator = useContext(navigationContext)
    .navigator as History

  useEffect(() => {
    if (!when) return

    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock()
          tx.retry()
        },
      }
      
      blocker(autoUnblockingTx)
    })

    return unblock
  }, [navigator, blocker, when])
}