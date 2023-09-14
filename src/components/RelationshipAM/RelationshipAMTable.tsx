import React, {useState, useEffect, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {DataTable} from 'primereact/datatable'
import {InputText} from 'primereact/inputtext'
import {Button, Row, Col} from 'react-bootstrap'
import {GlobalContext} from '../../store/GlobalContext'
import {usePagination, useCommonAccesibility, useHandleError} from '../../hooks'
import RelationshipAMService from '../../services/RelationshipAMService'
import {TemplatePaginator} from '../Paginator'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {RowTableActionType} from '../../store/actions'
import {defaultRelationshipAMsTablePaginationPerPage} from '../../constants/pagination'
import {IRelationshipAM} from '../../interface/relationshipAM'

export default function MarketplaceTable() {
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
  } = usePagination(defaultRelationshipAMsTablePaginationPerPage)

  const [relationshipAMs, setRelationshipAMs] = useState<IRelationshipAM[]>([])

  useEffect(() => {
    if (pagination) {
      new RelationshipAMService(axiosClient)
        .getRelationshipAMs(keyword, pagination)
        .then((response: any) => {
          if (response && response.data && response.data.content) {
            const relationshipAMsData = response.data.content.map((rel: IRelationshipAM) => ({
              ...rel,
            }))
            setRelationshipAMs(relationshipAMsData)
            setTotalRecords(response.data.totalElements)
          }
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination])

  useCommonAccesibility()

  const refreshInitialState = () => {
    setKeyword('')
    pagination &&
      setPagination({
        ...defaultPagination,
        sortField: pagination?.sortField,
        sortOrder: pagination?.sortOrder,
        keyword: ''
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
        value={relationshipAMs}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination?.first}
        rows={pagination?.rows}
        responsiveLayout='scroll'
        selectionMode='single'
        header={renderHeader}
        className='data-table-mh'
        paginatorClassName='table-paginator'
        emptyMessage={t('relationshipAM_table_empty_message')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          field='aggregator.name'
          header={t('relationshipAM_column_header_aggregator')}
          sortable
          sortField='aggregator.name'
          body={(rel: IRelationshipAM) => (
            <FieldTextDataTable value={rel.aggregator.name} placement='bottom' />
          )}
        ></Column>
        <Column
          field='name'
          header={t('relationshipAM_column_header_marketplace')}
          sortable
          sortField='name'
          body={(rel: IRelationshipAM) => (
            <FieldTextDataTable value={rel.name} placement='bottom' />
          )}
        ></Column>
      </DataTable>
    </>
  )
}
