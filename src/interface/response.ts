interface ISort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface IPageable {
  sort: ISort
  offset: number
  pageSize: number
  pageNumber: number
  unpaged: boolean
  paged: boolean
}

interface IPaginationResponse {
  pageable: IPageable
  last: boolean
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  numberOfElements: number
  sort: ISort
  empty: boolean
}

interface IFilterResponseData<T> extends IPaginationResponse {
  content: T
}

interface IDataListResponse<T> extends IFilterResponseData<T> {}

export type {IFilterResponseData, IDataListResponse, IPaginationResponse}
