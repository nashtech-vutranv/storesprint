import {DataTablePFSEvent} from 'primereact/datatable'

interface IPagination
  extends Omit<DataTablePFSEvent, 'multiSortMeta' | 'filters'> {
  keyword: string
}

export type {IPagination}
