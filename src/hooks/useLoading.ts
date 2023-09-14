import {useEffect, useState, SetStateAction, Dispatch} from 'react'

export const useLoading: () => {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
} = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const dataTableBody = document.getElementsByClassName(
      'p-datatable-tbody'
    )[0] as any

    if (dataTableBody && isLoading) {
      dataTableBody.classList.add('p-custom-height')
    }

    if (dataTableBody && !isLoading) {
      dataTableBody.classList.remove('p-custom-height')
    }
    
  }, [isLoading])

  return {
    isLoading,
    setIsLoading
  }
}