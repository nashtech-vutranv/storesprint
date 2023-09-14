import {useState, useEffect, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import _ from 'lodash'
import Select, {MultiValue} from 'react-select'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Col, Row, Button, Container, Accordion, Card} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import Searching from '../../components/Searching'
import {IWarehouse} from '../../interface/warehouse'
import WarehouseService from '../../services/WarehouseService'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {TemplatePaginator} from '../../components/Paginator'
import {
  usePagination,
  useCommonAccesibility,
  useSelectUrlParams,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import {transformToSelectData} from '../../helpers/select'
import OrganizationService from '../../services/OrganizationService'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {ROUTE_PARAMS, ROUTE_WAREHOUSE} from '../../constants'
import {GlobalContext} from '../../store/GlobalContext'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import PageTitle from '../../components/PageTitle/PageTitle'
import {defaultTablePaginationSortByErpIdPerPage} from '../../constants/pagination'
import {ISelectOption, IUrlParams} from '../../interface'
import {decodeParam, getURLParamsObj} from '../../helpers'
import CustomToggle from '../../components/CustomToggle/CustomToggle'

const Warehouse = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [selectOrganizationOptions, setSelectOrganizationOptions] = useState<
    ISelectOption[]
  >([])

  const {
    state: {
      pagesInfo: {
        warehouse: {searchData},
      },
      previousPage
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const [selectedOrganizations, setSelectedOrganizations] = useState<
    ISelectOption[]
  >(useSelectUrlParams(['orgLs', 'orgVs'], 'org'))
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )

  const {
    dataApi: {keyword, pagination, axiosClient, defaultPagination},
    dataTable: {
      totalRecords,
      setTotalRecords,
      onPage,
      onSort,
      onSearch,
      onKeywordChange,
      onBlurInputSearch,
      setPagination,
      setKeyword,
    },
  } = usePagination(undefined, true)

  const handleFilterChange = (options: MultiValue<ISelectOption>) => {
    setSelectedOrganizations(options as ISelectOption[])
    if (options.length !== 0) {
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        orgLs: options.map((x) => encodeURIComponent(x.label)).toString(),
        orgVs: options.map((x) => encodeURIComponent(x.value)).toString(),
      })
    } else {
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['orgLs', 'orgVs']),
      })
    }
  }

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

  const bindingWarehouses = (response: any) => {
    const warehouseData = response.data.content.map((warehouse: any) => {
      return {
        ...warehouse,
        status: capitalizeFirstLetter(warehouse.status),
      }
    })
    setWarehouses(warehouseData)
    setTotalRecords(response.data.totalElements)
  }

  const handleGetWarehousesUsedSearchData = () => {
    new WarehouseService(axiosClient)
      .getWarehouseByFilter(
        {
          ...pagination,
        },
        {
          organizationIds: searchData.selectedOrganizations
            ? searchData.selectedOrganizations.map((org: any) => org.value)
            : [],
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingWarehouses(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const onGetFiltersWarehousesData = () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_WAREHOUSE_PAGE_SEARCH_DATA,
      payload: selectedOrganizations,
    })
  }

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_WAREHOUSE_PAGE_SEARCH_DATA,
      payload: [],
    })
  }

  const onClearCurrentFilters = () => {
    setCurrentStatus(null)
    setSelectedURLParamsObj({
      ..._.omit(selectedURLParamsObj, [
        'search',
        'currentStatus',
        'orgVs',
        'orgLs',
      ]),
    })
    setKeyword('')
    setSelectedOrganizations([])
    clearSearchData()
  }

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount(searchCount + 1)
    onSearch()
  }

  const onPressKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearchCase()
    }
  }

  const templateLamda = TemplatePaginator('sample_lamda')

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex justify-content-start align-items-center'>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8} className='btn-mr-1'>
            <Searching
              value={keyword}
              onKeywordChange={onKeywordChange}
              placeholder={t('common_input_search_placeHolder')}
              onBlurInputSearch={onBlurInputSearch}
              onPressKeyDown={onPressKeyDown}
              setKeyword={setKeyword}
              setPagination={setPagination}
              pagination={pagination}
              setCurrentStatus={setCurrentStatus}
              setSearchCount={setSearchCount}
              searchCount={searchCount}
              setSelectedURLParamsObj={setSelectedURLParamsObj}
              selectedURLParamsObj={selectedURLParamsObj}
            />
          </Col>
          <Button onClick={onSearchCase} className='btn-h-95'>
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
      data-testid='refresh-button'
    />
  )

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    navigate(
      ROUTE_WAREHOUSE.EDIT.replace(ROUTE_PARAMS.WAREHOUSE_ID, e.value.id),
      {
        state: {
          viewlistLocation: location,
        },
      }
    )
  }

  useEffect(() => {
    if (!previousPage || previousPage && previousPage.name !== 'apps-warehouse') {
      clearSearchData()
    }
  }, [previousPage])

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

  useEffect(() => {
    if (currentStatus === 'apply' && pagination) {
      handleGetWarehousesUsedSearchData()
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (currentStatus === 'search' && pagination) {
      handleGetWarehousesUsedSearchData()
    }
  }, [pagination, searchCount, currentStatus])

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({
        ...defaultTablePaginationSortByErpIdPerPage,
        rows: 1000,
      })
      .then((response: any) => {
        const options = transformToSelectData(response.data.content)
        setSelectOrganizationOptions(options)
        if (options.length === 1) {
          setSelectedOrganizations(options)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (!currentStatus && pagination) {
      new WarehouseService(axiosClient)
        .getWarehouseByFilter(pagination, {})
        .then((response: any) => {
          bindingWarehouses(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, currentStatus])

  useCommonAccesibility()

  usePreviousPage('apps-warehouse', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.warehouse}></SeoConfig>
      <Row>
        <PageTitle title={t('warehouse_page_title')} />
        <Col xs={12}>
          <Card>
            <Card.Body style={{border: 'none'}}>
              <Accordion
                defaultActiveKey={decodeParam('collapse', searchParams) || '0'}
                id='accordion'
                className='custom-accordion'
              >
                <div className='d-flex align-items-center'>
                  <CustomToggle
                    eventKey='filter-accordion'
                    containerClass=''
                    style={{marginRight: '0.5rem'}}
                    linkClass=''
                    name='product'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('products_fitler_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organization-name'>
                          {t('products_filter_organization_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectOrganizationOptions}
                          value={selectedOrganizations}
                          placeholder={t(
                            'products_filter_organization_placeHolder'
                          )}
                          isMulti={true}
                          isSearchable
                          onChange={(value) => handleFilterChange(value)}
                          className='react-select'
                          classNamePrefix='react-select'
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={7} className='text-center'>
                        <Button
                          className='me-2'
                          variant='danger'
                          onClick={onClearCurrentFilters}
                        >
                          {t('common_button_reset_label')}
                        </Button>
                        <Button
                          variant='success'
                          onClick={onGetFiltersWarehousesData}
                        >
                          {t('common_button_apply_label')}
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Accordion.Collapse>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={warehouses}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          onSelectionChange={(e) => onSelectionChange(e)}
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(warehouses)
              ? t('warehouse_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('warehouse_column_header_id')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('warehouse_column_header_name')}
            field='name'
            sortable
            body={(data: IWarehouse) => (
              <FieldTextDataTable value={data.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('warehouse_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
export default Warehouse
