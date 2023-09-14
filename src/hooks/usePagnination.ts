import {useState, useContext, ChangeEvent, useLayoutEffect} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import {GlobalContext} from '../store/GlobalContext'
import {IPagination, CommonStateUrlParams} from '../interface'
import {defaultTablePaginationSortByErpIdPerPage} from '../constants/pagination'
import {RowTableActionType} from '../store/actions'

export const defaultPagination: IPagination = {
  ...defaultTablePaginationSortByErpIdPerPage,
}

const usePagination = (defaultValue?: IPagination, updateFromUrlParam?: boolean) => {
  const {
    state: {auth, axiosClient, rowTable},
    dispatch: {rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const [searchParams] = useSearchParams()

  const decodeParam = (key: CommonStateUrlParams) => {
    if (searchParams.get(key)) {
      return decodeURIComponent(searchParams.get(key) as string)
    } else return null
  }

  const [keyword, setKeyword] = useState(decodeParam('search') || '')
  const [pagination, setPagination] = useState<IPagination | null>(null)
  const [totalRecords, setTotalRecords] = useState<number>(0)

  const {id} = useParams<{id: string}>()

  const onPage = (event: any) => {
    pagination &&
      setPagination({
        ...pagination,
        keyword: keyword,
        first: event.first,
        rows: event.rows,
        page: event.page ? event.page + 1 : 1,
      })

    if (event.rows !== rowTable) {
      rowTableDispatch({
        type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
        payload: event.rows,
      })
    }
  }

  const onSort = (event: any) => {
    pagination &&
      setPagination({
        ...pagination,
        sortField: event.sortField,
        sortOrder: event.sortOrder,
      })
  }

  const onSearch = () => {
    setPagination({
      ...pagination,
      keyword: encodeURIComponent(keyword.trim()),
    })
  }

  const onKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  const onBlurInputSearch = () => {
    setKeyword(keyword.trim())
  }

  const updatePaginationLocally = () => {
    if (defaultValue) {
      setPagination({...defaultValue, rows: rowTable})
    } else {
      setPagination({...defaultPagination, rows: rowTable})
    }
  }

  const updatePaginationFromUrl = (paginationObj: IPagination) => {
    setPagination({
      ...paginationObj,
      rows: rowTable,
      page: Number(decodeParam('page')) || paginationObj.page,
      sortField: decodeParam('sortField') || paginationObj.sortField,
      sortOrder: Number(decodeParam('sortOrder')) || paginationObj.sortOrder,
      keyword: decodeParam('search') || paginationObj.keyword,
      first: Number(decodeParam('first')) || paginationObj.first,
    })
  }

  useLayoutEffect(() => {
    if (!updateFromUrlParam) {
      updatePaginationLocally()
    } else {
      if (defaultValue) {
        updatePaginationFromUrl(defaultValue)
      } else {
        updatePaginationFromUrl(defaultPagination)
      }
    }
  }, [])

  return {
    dataApi: {
      id,
      keyword,
      pagination,
      auth,
      axiosClient,
      defaultPagination,
    },
    dataTable: {
      totalRecords,
      setTotalRecords,
      onPage,
      onSort,
      onSearch,
      onKeywordChange,
      setPagination,
      setKeyword,
      onBlurInputSearch,
    },
  }
}

export default usePagination
