import {IPaginationResponse} from '../../interface'

export const mockOption = () => ({
  value: '',
  label: '',
})

export const mockPaginationResponse = (): IPaginationResponse => {
  return {
    pageable: {
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      offset: 0,
      pageSize: 3,
      pageNumber: 0,
      unpaged: false,
      paged: true,
    },
    last: false,
    totalPages: 2,
    totalElements: 5,
    number: 0,
    size: 3,
    first: true,
    numberOfElements: 3,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    empty: false,
  }
}
