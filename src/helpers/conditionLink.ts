
import {PaginatorPageLinksOptions} from 'primereact/paginator'

export const conditionLink = (options: PaginatorPageLinksOptions) => {
 return (
    (options.view.startPage === options.page
      && options.view.startPage !== 0) 
      ||
    (options.view.endPage === options.page 
      && options.page + 1 !== options.totalPages)
 )
}