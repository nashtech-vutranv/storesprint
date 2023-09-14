import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {defaulProductPriceTablePaginationPerPage} from '../../constants/pagination'
import {IProductPrice} from '../../interface/products'
import ProductServices from '../../services/ProductService'
import {GlobalContext} from '../../store/GlobalContext'
import {TemplatePaginator} from '../Paginator'
import {RowTableActionType} from '../../store/actions'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {usePagination, useHandleError} from '../../hooks'
import {formatDate} from '../../utils'

export interface IProductPriceTableProps {
  productId?: string
}

export default function ProductPriceTable({
  productId,
}: IProductPriceTableProps) {
  const {t} = useTranslation()
  const [productProces, setProductPrices] = useState<IProductPrice[]>([])

  const {
    state: {axiosClient},
    dispatch: {rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {pagination, defaultPagination},
    dataTable: {totalRecords, setTotalRecords, onPage, onSort, setPagination},
  } = usePagination(defaulProductPriceTablePaginationPerPage)

  useEffect(() => {
    if (productId) {
      getWarehouseProductStock()
    }
  }, [productId, pagination])

  useEffect(() => {
    document.querySelectorAll('.p-dropdown-trigger').forEach((el) => {
      el.setAttribute('aria-label', 'dropdown-trigger')
    })
  }, [document.querySelectorAll('.p-dropdown-trigger')])

  const getWarehouseProductStock = () => {
    if (pagination) {
      new ProductServices(axiosClient)
        .getPricesByProductId(`${productId}`, pagination)
        .then((response) => {
          const mapData = response.data.content.map((x: IProductPrice) => ({
            ...x,
            modifiedAt: formatDate(x.modifiedAt),
          }))
          setProductPrices(mapData)
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

  return (
    <>
      <DataTable
        sortField={pagination?.sortField}
        sortOrder={pagination?.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={productProces}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination?.first}
        rows={pagination?.rows}
        responsiveLayout='scroll'
        selectionMode='single'
        className='data-table-mh mt-4'
        paginatorClassName='table-paginator'
        emptyMessage={t('product_detail_table_no_data')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          header={t('product_detail_price_table_site')}
          sortable
          sortField='siteLocale.site.name'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable value={wps.site} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_locale')}
          sortable
          sortField='siteLocale.locale.name'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable value={wps.locale} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_currency')}
          sortable
          sortField='currencyPriceId'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable value={wps.currency} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_sales_price')}
          sortable
          sortField='sellingPrice'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable
              value={wps.salesPrice == null ? '' : wps.salesPrice.toString()}
              placement='bottom'
              align='left'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_rrp')}
          sortable
          sortField='rrp'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable
              value={wps.rrp == null ? '' : wps.rrp.toString()}
              placement='bottom'
              align='left'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_date_modified')}
          sortable
          sortField='modifiedAt'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable
              value={wps.modifiedAt}
              placement='bottom'
              align='left'
            />
          )}
        ></Column>
        <Column
          header={t('product_detail_price_table_modified_by')}
          sortable
          sortField='modifiedBy'
          body={(wps: IProductPrice) => (
            <FieldTextDataTable value={wps.modifiedBy} placement='bottom' />
          )}
        ></Column>
      </DataTable>
    </>
  )
}
