import {useEffect, Dispatch, SetStateAction} from 'react'
import {URLSearchParamsInit} from 'react-router-dom'
import {IUrlParams, IPagination} from '../interface'

const useCountLoading = (
  countLoadingPage: number,
  setSearchParams: (
    nextInit: URLSearchParamsInit,
    navigateOptions?:
      | {
          replace?: boolean | undefined
          state?: any
        }
      | undefined
  ) => void,
  selectedURLParamsObj: IUrlParams,
  setSelectedURLParamsObj: Dispatch<SetStateAction<IUrlParams>>,
  pagination: IPagination | null,
  clearSearchData: () => void,
  location: any,
  isClearSearchData?: boolean
) => {
  useEffect(() => {
    if (countLoadingPage === 0) return
    setSearchParams(selectedURLParamsObj as any)
  }, [selectedURLParamsObj])

  useEffect(() => {
    pagination &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        search: pagination.keyword,
        page: pagination.page,
        sortField: pagination.sortField,
        sortOrder: pagination.sortOrder,
        first: pagination.first,
      })
  }, [pagination])

  useEffect(() => {
    if (isClearSearchData && countLoadingPage === 0 && !location.state) {
      clearSearchData()
    }
  }, [location])
}

export default useCountLoading