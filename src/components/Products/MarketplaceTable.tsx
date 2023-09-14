import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import _ from 'lodash'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {defaulMarketplaceTablePaginationPerPage} from '../../constants/pagination'
import {capitalizeFirstLetter} from '../../helpers'
import {TemplatePaginator} from '../Paginator'
import {RowTableActionType} from '../../store/actions'
import ProductServices from '../../services/ProductService'
import {GlobalContext} from '../../store/GlobalContext'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {usePagination, useHandleError} from '../../hooks'
import {formatDate} from '../../utils'

export interface IMarketplaceProductTableProps {
  productId?: string
}

export default function MarketplaceTable({productId}: IMarketplaceProductTableProps) {
  const {t} = useTranslation()
  const [marketplaceProducts, setMarketplaceProducts] = useState<any[]>([])

  const {
    state: {axiosClient},
    dispatch: {rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {pagination, defaultPagination},
    dataTable: {totalRecords, setTotalRecords, onPage, onSort, setPagination},
  } = usePagination(defaulMarketplaceTablePaginationPerPage)

  const getMarketplaceProductById = () => {
    if (productId) {
      new ProductServices(axiosClient)
        .getMarketplacesByProductId(productId, _.omit(pagination, ['keyword']))
        .then((response) => {
          setMarketplaceProducts(
            response.data.content.map((item: any) => ({
              ...item,
              createdAt: formatDate(item.createdAt)
            }))
          )
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }

  const refreshInitialState = () => {
    pagination &&
      setPagination({
        ...defaultPagination,
        sortField: pagination?.sortField,
        sortOrder: pagination?.sortOrder,
      })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  const templateLamda = TemplatePaginator('sample_lamda')

  const paginatorLeft = (
    <ButtonPrime
      aria-label='refresh-button'
      type='button'
      icon='pi pi-refresh'
      className='p-button-text refresh-button'
      onClick={refreshInitialState}
      tooltip={t('common_button_refresh_table')}
    />
  )

  useEffect(() => {
    pagination && productId && getMarketplaceProductById()
  }, [productId, pagination])

  useEffect(() => {
    document.querySelectorAll('.p-dropdown-trigger').forEach((el) => {
      el.setAttribute('aria-label', 'dropdown-trigger')
    })
  }, [document.querySelectorAll('.p-dropdown-trigger')])

  return (
    <>
      <DataTable
        sortField={pagination?.sortField}
        sortOrder={pagination?.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={marketplaceProducts}
        first={pagination?.first}
        rows={pagination?.rows}
        paginator
        paginatorTemplate={templateLamda}
        paginatorClassName='table-paginator'
        responsiveLayout='scroll'
        selectionMode='single'
        className='data-table-mh mt-4'
        emptyMessage={t('product_detail_table_no_data')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          header={t('product_detail_marketplace_table_marketplace')}
          sortable
          sortField='localeMarketplace.marketplace.name'
          body={(data: any) => (
            <FieldTextDataTable
              value={data.marketplace.name}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_listed_price')}
          sortable
          sortField='sellingPrice'
          body={(data: any) => (
            <FieldTextDataTable value={data.sellingPrice} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_currencry')}
          sortable
          sortField='localeMarketplace.marketplace.currency.id'
          body={(data: any) => (
            <FieldTextDataTable value={data.currency.id} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_quantity')}
          sortable
          sortField='listingQuantity'
          body={(data: any) => (
            <FieldTextDataTable
              value={data.listingQuantity}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_listed_date')}
          sortable
          sortField='createdAt'
          body={(data: any) => (
            <FieldTextDataTable value={data.createdAt} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_status')}
          sortable
          sortField='listingState.status'
          body={(data: any) => (
            <FieldTextDataTable
              value={capitalizeFirstLetter(data.listingState.status)}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_marketplace_table_failed_reason')}
          sortable
          sortField='listingState.errorMessage'
          body={(data: any) => (
            <FieldTextDataTable
              value={data.listingState.errorMessage}
              placement='bottom'
            />
          )}
        ></Column>
      </DataTable>
    </>
  )
}
