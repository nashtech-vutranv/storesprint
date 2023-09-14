import {useState, useEffect, FC, useContext} from 'react'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Button, Row, Col} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {GlobalContext} from '../../store/GlobalContext'
import {OrganizationActionType, RowTableActionType} from '../../store/actions'
import {TemplatePaginator} from '../Paginator'
import {IOrganization, IUrlParams} from '../../interface'
import OrganizationService from '../../services/OrganizationService'
import {getURLParamsObj} from '../../helpers'
import {usePagination, useCommonAccesibility, useHandleError, usePreviousPage} from '../../hooks'
import {capitalizeFirstLetter} from '../../helpers/characters'
import FieldTextDataTable from '../FieldTextDataTable/FieldTextDataTable'
import {PERMISSIONS, ROUTE_ORG, ROUTE_PARAMS} from '../../constants'
import {AddButton} from '../Common'
import Searching from '../Searching'

const OrganizationTable: FC = () => {
  const {t} = useTranslation()

  const [organizations, setOrganizations] = useState<IOrganization[]>([])
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [, setSearchParams] = useSearchParams()

  const navigate = useNavigate()
  const location = useLocation()

  const {
    state: {axiosClient},
    dispatch: {organization: orgDispatch, rowTable: rowTableDispatch},
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
  } = usePagination(undefined, true)

  const refreshInitialState = () => {
    setKeyword('')
    pagination &&
      setPagination({
        ...defaultPagination,
        sortField: pagination.sortField,
        sortOrder: pagination.sortOrder,
      })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  const templateLamda = TemplatePaginator('sample_lamda')

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    orgDispatch({
      type: OrganizationActionType.GET_ORGANIZATION_INFORMATION,
      payload: e.value,
    })
    navigate(ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, e.value.id), {
      state: {
        viewlistLocation: location,
      },
    })
  }

  const directToOrganizationCreatePage = () => {
    navigate(ROUTE_ORG.ADD)
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
      onClick={directToOrganizationCreatePage}
      label={t('organization_paginator_add_organization')}
      permissions={[PERMISSIONS.add_org]}
    />
  )

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  useEffect(() => {
    if (pagination) {
      new OrganizationService(axiosClient)
        .getAllOrganizationsByKeyword(pagination)
        .then((response: any) => {
          const mappingData = response.data
          const organizationsData = mappingData.content.map((item: any) => ({
            ...item,
            status: capitalizeFirstLetter(item.status),
          }))
          setOrganizations(organizationsData)
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

  usePreviousPage('apps-organizations', {})

  useCommonAccesibility()

  return (
    <>
      <DataTable
        sortField={pagination && pagination.sortField}
        sortOrder={pagination && pagination.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={organizations}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination && pagination.first}
        rows={pagination && pagination.rows}
        onSelectionChange={(e) => onSelectionChange(e)}
        responsiveLayout='scroll'
        selectionMode='single'
        header={renderHeader}
        className='data-table-mh'
        paginatorClassName='table-paginator'
        emptyMessage={t('organization_table_empty_message')}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        lazy
        onSort={onSort}
        onPage={onPage}
      >
        <Column
          header={t('organization_column_header_erpId')}
          field='erpId'
          sortable
        ></Column>
        <Column
          field='name'
          header={t('organization_column_header_name')}
          sortable
          body={(org: IOrganization) => (
            <FieldTextDataTable value={org.name} placement='bottom' />
          )}
        ></Column>
        <Column
          field='status'
          header={t('organization_column_header_status')}
          sortable
        ></Column>
      </DataTable>
    </>
  )
}

export default OrganizationTable
