import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {useHandleError} from '../../hooks'
import OrderService from '../../services/OrderService'
import {GlobalContext} from '../../store/GlobalContext'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {IOrderLine} from '../../interface/order'
import {ROUTE_PRODUCT, ROUTE_PARAMS} from '../../constants'

export interface IOrderlineTableProps {
  orderId?: string,
  getOrderDetail?: () => void
}

export default function OrderlineTable({orderId, getOrderDetail}: IOrderlineTableProps) {
  const {t} = useTranslation()
  const [orderLines, setOrderLines] = useState<IOrderLine[]>([])

  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  useEffect(() => {
    if (orderId) {
      getOrderLines()
    }
  }, [orderId])

  const getOrderLines = () => {
    new OrderService(axiosClient)
      .getOrderlines(`${orderId}`)
      .then((response: any) => {
        setOrderLines(response.data)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }
  
  const formatPrice = (price: string) => {
    return price.replace(/\.?0+$/, '')
  }

  const refreshData = () => {
    getOrderLines()
    if (getOrderDetail) {
      getOrderDetail()
    }
  }

  const paginatorLeft = (
    <ButtonPrime
      aria-label='refresh-button'
      type='button'
      icon='pi pi-refresh'
      className='p-button-text refresh-button'
      onClick={refreshData}
      tooltip={t('common_button_refresh_table')}
    />
  )

  return (
    <>
      <DataTable
        dataKey='id'
        value={orderLines}
        rows={orderLines.length}
        totalRecords={orderLines.length}
        responsiveLayout='scroll'
        selectionMode='single'
        className='data-table-mh mt-4'
        emptyMessage={t('order_detail_table_no_data')}
        paginator
        paginatorTemplate=''
        paginatorClassName='table-paginator'
        paginatorLeft={paginatorLeft}
        lazy
      >
        <Column
          header={t('order_detail_table_product_erp_id')}
          body={(orderLine: IOrderLine) => (
            <FieldTextDataTable
              value={orderLine.product?.erpId}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_name')}
          body={(orderLine: IOrderLine) => (
            <Link
              to={ROUTE_PRODUCT.DETAIL.replace(
                ROUTE_PARAMS.PRODUCT_ID,
                orderLine.product?.id || ''
              )}
            >
              {orderLine.product?.name}
            </Link>
          )}
        ></Column>
        <Column
          header={t('order_detail_table_quantity')}
          body={(orderLine: IOrderLine) => (
            <FieldTextDataTable value={orderLine.quantity} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_price')}
          body={(orderLine: IOrderLine) => (
            <FieldTextDataTable value={formatPrice(orderLine.price)} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_tax')}
          body={(orderLine: IOrderLine) => (
            <FieldTextDataTable
              value={orderLine.taxAppliedPerUnit}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('order_detail_table_orderline_status')}
          body={(orderLine: IOrderLine) => (
            <FieldTextDataTable
              value={orderLine.orderlineStatus}
              placement='bottom'
            />
          )}
        ></Column>
      </DataTable>
    </>
  )
}
