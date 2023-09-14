import React, {useState, useEffect, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {DataTable} from 'primereact/datatable'
import {InputText} from 'primereact/inputtext'
import {Button, Row, Col} from 'react-bootstrap'
import {GlobalContext} from '../../store/GlobalContext'
import {usePagination, useCommonAccesibility, useHandleError} from '../../hooks'
import AggregatorService from '../../services/AggregatorService'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {IAggregator} from '../../interface/aggregator'
import {TemplatePaginator} from '../Paginator'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {RowTableActionType} from '../../store/actions'
import {defaultAggregatorsTablePaginationPerPage} from '../../constants/pagination'

export default function AggregatorTable() {
  const {t} = useTranslation()
  const {
    state: {axiosClient},
    dispatch: {rowTable: rowTableDispatch},
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
  } = usePagination(defaultAggregatorsTablePaginationPerPage)

  const [aggregators, setAggregators] = useState<IAggregator[]>([])

  useEffect(() => {
    if (pagination) {
      new AggregatorService(axiosClient)
      .fetchAllAggregators(pagination, {
        search: keyword,
      })
      .then((response: any) => {
        const mappingData = response.data
        const aggregatorsData = mappingData.content.map((item: any) => ({
          ...item,
          status: capitalizeFirstLetter(item.status),
        }))
        setAggregators(aggregatorsData)
        setTotalRecords(mappingData.totalElements)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
    }
  }, [pagination])

  useCommonAccesibility()

  const refreshInitialState = () => {
    setKeyword('')
    pagination && setPagination({
      ...defaultPagination,
      sortField: pagination?.sortField,
      sortOrder: pagination?.sortOrder,
    })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex justify-content-start align-items-center'>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8} className='btn-mr-1'>
            <InputText
              value={keyword}
              onChange={onKeywordChange}
              placeholder={t('common_input_search_placeHolder')}
              className='w-100'
              onBlur={onBlurInputSearch}
              onKeyDown={(event: any) => event.key === 'Enter' && onSearch()}
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

  return (
    <>
      <DataTable
        sortField={pagination?.sortField}
        sortOrder={pagination?.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={aggregators}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination?.first}
        rows={pagination?.rows}
        responsiveLayout='scroll'
        selectionMode='single'
        header={renderHeader}
        className='data-table-mh'
        paginatorClassName='table-paginator'
        emptyMessage={t('aggregator_table_empty_message')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          field='name'
          header={t('aggregator_column_header_name')}
          sortable
          body={(agg: IAggregator) => (
            <FieldTextDataTable value={agg.name} placement='bottom' />
          )}
        ></Column>
        <Column
          field='status'
          header={t('aggregator_column_header_status')}
          sortable
        ></Column>
      </DataTable>
    </>
  )
}
