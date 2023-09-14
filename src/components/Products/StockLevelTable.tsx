import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {defaulStockLevelTablePaginationPerPage} from '../../constants/pagination'
import {IWarehouseProductStock} from '../../interface/products'
import ProductServices from '../../services/ProductService'
import {GlobalContext} from '../../store/GlobalContext'
import {TemplatePaginator} from '../Paginator'
import {RowTableActionType} from '../../store/actions'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {usePagination, useCommonAccesibility, useHandleError} from '../../hooks'
import {formatDate} from '../../utils'

export interface IStockLevelTableProps {
  productId?: string
}

export default function StockLevelTable({productId}: IStockLevelTableProps) {
  const {t} = useTranslation()
  const [totalStockLevel, setTotalStockLevel] = useState<number>(0)
  const [warehouseProductStock, setWarehouseProductStock] = useState<
    IWarehouseProductStock[]
  >([])

  const {
    state: {axiosClient},
    dispatch: {rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {pagination, defaultPagination},
    dataTable: {totalRecords, setTotalRecords, onPage, onSort, setPagination},
  } = usePagination(defaulStockLevelTablePaginationPerPage)

  useEffect(() => {
    if (productId) {
      getTotalStockLevel()
    }
  }, [productId])

  useEffect(() => {
    if (productId) {
      getWarehouseProductStock()
    }
  }, [productId, pagination])

  const getTotalStockLevel = () => {
    new ProductServices(axiosClient)
      .getTotalStockLevelByProductId(`${productId}`)
      .then((response) => {
        setTotalStockLevel(response.data.totalStockLevel)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getWarehouseProductStock = () => {
    if (pagination) {
      new ProductServices(axiosClient)
        .getWarehouseProductStockByProductId(`${productId}`, pagination)
        .then((response) => {
          const mapData = response.data.content.map(
            (x: IWarehouseProductStock) => ({
              ...x,
              modifiedAt: formatDate(x.modifiedAt),
            })
          )
          setWarehouseProductStock(mapData)
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

    getTotalStockLevel()
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

  return (
    <div>
      <h5>{`${t('product_detail_total_stock_level')}: ${totalStockLevel}`}</h5>
      <div>
        <DataTable
          sortField={pagination?.sortField}
          sortOrder={pagination?.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={warehouseProductStock}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination?.first}
          rows={pagination?.rows}
          responsiveLayout='scroll'
          selectionMode='single'
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={t('product_detail_table_no_data')}
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('product_detail_stock_level_table_warehouse')}
            sortable
            sortField='organizationWarehouse.name'
            body={(wps: IWarehouseProductStock) => (
              <FieldTextDataTable
                value={wps.warehouseName}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('product_detail_stock_level_table_stock_level')}
            sortable
            sortField='stockLevel'
            body={(wps: IWarehouseProductStock) => (
              <FieldTextDataTable
                value={wps.stockLevel.toString()}
                placement='bottom'
                align='left'
              />
            )}
          ></Column>
          <Column
            header={t('product_detail_stock_level_table_date_modified')}
            sortable
            sortField='modifiedAt'
            body={(wps: IWarehouseProductStock) => (
              <FieldTextDataTable
                value={wps.modifiedAt}
                placement='bottom'
                align='left'
              />
            )}
          ></Column>
          <Column
            header={t('product_detail_stock_level_table_modified_by')}
            sortable
            sortField='modifiedBy'
            body={(wps: IWarehouseProductStock) => (
              <FieldTextDataTable value={wps.modifiedBy} placement='bottom' />
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  )
}