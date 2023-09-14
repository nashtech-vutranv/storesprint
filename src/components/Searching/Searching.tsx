import {FC, ChangeEvent, Dispatch, SetStateAction} from 'react'
import {InputText} from 'primereact/inputtext'
import _ from 'lodash'
import {IPagination, IUrlParams} from '../../interface'

interface ISearching {
  value: string
  onKeywordChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string | undefined
  onBlurInputSearch: () => void
  onPressKeyDown: (e: any) => void
  setKeyword: Dispatch<SetStateAction<string>>
  setPagination: Dispatch<SetStateAction<IPagination | null>>
  pagination: IPagination | null
  setCurrentStatus?: (value: SetStateAction<string | null>) => void
  setSelectedURLParamsObj?: (value: SetStateAction<IUrlParams>) => void
  setSearchCount?: (value: SetStateAction<number>) => void
  selectedURLParamsObj?: IUrlParams
  searchCount?: number
}

const Searching: FC<ISearching> = (props) => {
  const {
    value,
    onKeywordChange,
    placeholder,
    onBlurInputSearch,
    onPressKeyDown,
    setKeyword,
    setPagination,
    pagination,
    setCurrentStatus,
    setSelectedURLParamsObj,
    setSearchCount,
    selectedURLParamsObj,
    searchCount,
  } = props

  const handleClearSearching = () => {
    setKeyword('')
    setPagination({
      ...pagination,
      keyword: ''
    })
    setCurrentStatus && setCurrentStatus('search')
    setSelectedURLParamsObj && selectedURLParamsObj && setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount && searchCount && setSearchCount(searchCount + 1)
  }

    return (
      <span className='p-input-icon-right d-block'>
        {!_.isEmpty(value) && (<i
          className='dripicons-cross dripicons-md-size close-icon d-flex align-items-center'
          onClick={handleClearSearching}
        ></i>)}
        <InputText
          value={value}
          onChange={onKeywordChange}
          placeholder={placeholder}
          onBlur={onBlurInputSearch}
          onKeyDown={onPressKeyDown}
        />
      </span>
    ) 
}

export default Searching
