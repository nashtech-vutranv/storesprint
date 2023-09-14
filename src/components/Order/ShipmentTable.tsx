import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import OrderService from '../../services/OrderService'
import {GlobalContext} from '../../store/GlobalContext'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {IShipments} from '../../interface/order'
import {defaulOrderShipmentTablePaginationPerPage} from '../../constants/pagination'
import {RowTableActionType} from '../../store/actions'
import {formatDate} from '../../utils'
import {usePagination, useCommonAccesibility, useHandleError} from '../../hooks'
import {TemplatePaginator} from '../Paginator'

export interface IShipmentTableProps {
  orderId?: string
}

export default function ShipmentTable({orderId}: IShipmentTableProps) {
  const {t} = useTranslation()
  const [shipments, setShipments] = useState<IShipments[]>([])

  const {
    state: {axiosClient},
    dispatch: {rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {pagination, defaultPagination},
    dataTable: {totalRecords, setTotalRecords, onPage, onSort, setPagination},
  } = usePagination(defaulOrderShipmentTablePaginationPerPage)

  useEffect(() => {
    if (orderId) {
      getShipments()
    }
  }, [orderId, pagination])

  const getShipments = () => {
    if (pagination) {
      new OrderService(axiosClient)
        .getShipments(`${orderId}`, pagination)
        .then((response: any) => {
          const mapData = response.data.content.map((x: IShipments) => ({
            ...x,
            shipment: {
              ...x.shipment,
              despatchedDate: formatDate(x.shipment.despatchedDate),
            },
          }))
          setShipments(mapData)
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

  useCommonAccesibility()

  useEffect(() => {
    document.querySelectorAll('[rel="noreferrer"]').forEach((el) => {
      if (el) el.setAttribute('aria-label', 'a-label')
    })
  }, [document.querySelectorAll('[rel="noreferrer"]')])

  return (
    <>
      <DataTable
        sortField={pagination?.sortField}
        sortOrder={pagination?.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={shipments}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination?.first}
        rows={pagination?.rows}
        responsiveLayout='scroll'
        selectionMode='single'
        className='data-table-mh mt-4'
        paginatorClassName='table-paginator'
        emptyMessage={t('order_detail_table_no_data')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          header={t('order_detail_table_shipment_number')}
          sortable
          sortField='shipment.shipmentNumber'
          body={(wps: IShipments) => (
            <FieldTextDataTable
              value={wps.shipment.shipmentNumber}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_product_name')}
          sortable
          sortField='product.name'
          body={(wps: IShipments) => (
            <FieldTextDataTable value={wps.product.name} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_quantity')}
          sortable
          sortField='quantity'
          body={(wps: IShipments) => (
            <FieldTextDataTable value={wps.quantity} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_despatched_date')}
          sortable
          sortField='shipment.despatchedDate'
          body={(wps: IShipments) => (
            <FieldTextDataTable
              value={wps.shipment.despatchedDate}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_tracking_url')}
          body={(wps: IShipments) => (
            <a href={wps.shipment.trackingUrl} target='_blank' rel='noreferrer' style={{display: 'inline-block', fontSize: '20px'}}>
              <i className="uil uil-external-link-alt"></i>
            </a>
          )}
        ></Column>
      </DataTable>
    </>
  )
}
