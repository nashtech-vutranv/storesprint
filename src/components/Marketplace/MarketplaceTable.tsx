import React, {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Button, Row, Col} from 'react-bootstrap'
import {GlobalContext} from '../../store/GlobalContext'
import {usePagination, useCommonAccesibility, useHandleError, usePreviousPage} from '../../hooks'
import MarketplaceService from '../../services/MarketplaceService'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {TemplatePaginator} from '../Paginator'
import {ROUTE_MARKETPLACE, ROUTE_PARAMS, PERMISSIONS} from '../../constants'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {MarketplaceActionType, RowTableActionType} from '../../store/actions'
import {defaultMarketplacesTablePaginationPerPage} from '../../constants/pagination'
import {IMarketplace} from '../../interface/marketplace'
import {AddButton} from '../Common'
import {getURLParamsObj} from '../../helpers'
import {IUrlParams} from '../../interface'
import Searching from '../Searching'

export default function MarketplaceTable() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [, setSearchParams] = useSearchParams()

  const {
    state: {axiosClient},
    dispatch: {marketplace: marketplaceDispatch, rowTable: rowTableDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {keyword, pagination, defaultPagination},
    dataTable: {
      totalRecords,
      setTotalRecords,
      onPage,
      onSort,
      onSearch,
      onKeywordChange,
      setPagination,
      setKeyword,
      onBlurInputSearch,
    },
  } = usePagination(defaultMarketplacesTablePaginationPerPage, true)

  const [marketplaces, setMarketplaces] = useState<IMarketplace[]>([])

  useEffect(() => {
    if (pagination) {
      new MarketplaceService(axiosClient)
        .fetchAllMarketplaces(pagination, {
          search: keyword,
        })
        .then((response: any) => {
          const mappingData = response.data
          const marketplacesData = mappingData.content.map((item: any) => ({
            ...item,
            status: capitalizeFirstLetter(item.status),
          }))
          setMarketplaces(marketplacesData)
          setTotalRecords(mappingData.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination])

  useEffect(() => {
    setSearchParams(selectedURLParamsObj as any)
  }, [selectedURLParamsObj])

  useEffect(() => {
    pagination &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        search: pagination.keyword,
        page: pagination.page,
        sortField: pagination.sortField,
        sortOrder: pagination.sortOrder,
        first: pagination.first,
      })
  }, [pagination])

  usePreviousPage('apps-marketplaces', {})

  useCommonAccesibility()

  const refreshInitialState = () => {
    setKeyword('')
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

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    marketplaceDispatch({
      type: MarketplaceActionType.GET_MARKETPLACE_INFORMATION,
      payload: e.value,
    })
    navigate(
      ROUTE_MARKETPLACE.EDIT.replace(ROUTE_PARAMS.MARKETPLACE_ID, e.value.id),
      {
        state: {
          viewlistLocation: location,
        },
      }
    )
  }

  const onPressKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex justify-content-start align-items-center'>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8} className='btn-mr-1'>
            <Searching
              value={keyword}
              setKeyword={setKeyword}
              onKeywordChange={onKeywordChange}
              placeholder={t('common_input_search_placeHolder')}
              onBlurInputSearch={onBlurInputSearch}
              onPressKeyDown={onPressKeyDown}
              pagination={pagination}
              setPagination={setPagination}
            />
          </Col>
          <Button onClick={onSearch} className='btn-h-95'>
            {t('common_button_search_label')}
          </Button>
        </div>
      </Row>
    )
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

  const paginatorRight = (
    <AddButton
      onClick={() => navigate(ROUTE_MARKETPLACE.ADD)}
      permissions={[PERMISSIONS.add_marketplace]}
      label={t('marketplace_paginator_add_marketplace')}
    />
  )

  return (
    <>
      <DataTable
        sortField={pagination?.sortField}
        sortOrder={pagination?.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={marketplaces}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination?.first}
        rows={pagination?.rows}
        onSelectionChange={(e) => onSelectionChange(e)}
        responsiveLayout='scroll'
        selectionMode='single'
        header={renderHeader}
        className='data-table-mh'
        paginatorClassName='table-paginator'
        emptyMessage={t('marketplace_table_empty_message')}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          field='name'
          header={t('marketplace_column_header_name')}
          sortable
          body={(agg: IMarketplace) => (
            <FieldTextDataTable value={agg.name} placement='bottom' />
          )}
        ></Column>
        <Column
          field='currencyId'
          header={t('marketplace_column_header_currency')}
          sortable
          sortField='currency.name'
          body={(agg: IMarketplace) => (
            <FieldTextDataTable value={agg.currency?.name} placement='bottom' />
          )}
        ></Column>
        <Column
          field='status'
          header={t('marketplace_column_header_status')}
          sortable
        ></Column>
      </DataTable>
    </>
  )
}
