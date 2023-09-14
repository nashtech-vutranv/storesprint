import {useCallback, useState} from 'react'

type LoadingStatus = 'pending' | 'completed' | 'failed' | 'processing'

export default function useProcessLoading() {
  const [statusLoading, setStatusLoading] = useState<LoadingStatus>('pending')

  const changeToCompleted = useCallback(() => {
    setStatusLoading('completed')
  }, [])

  const changeToFailed = useCallback(() => {
    setStatusLoading('failed')
  }, [])

  const changeToProcessing = useCallback(() => {
    setStatusLoading('processing')
  }, [])

  const resetStatus = useCallback(() => {
    setStatusLoading('pending')
  }, [])

  return {
    changeToCompleted,
    changeToFailed,
    changeToProcessing,
    resetStatus,
    isProcessing: statusLoading === 'processing'
  }

}
