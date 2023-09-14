import _ from 'lodash'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import {Accordion, Button, Card, Col, Container, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import Select, {SingleValue} from 'react-select'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import CustomToggle from '../../components/CustomToggle'
import PageTitle from '../../components/PageTitle/PageTitle'
import {TemplatePaginator} from '../../components/Paginator'
import {SeoConfig} from '../../components/SEO/SEO-Component'
import {courierMappingsTablePaginationPerPage} from '../../constants/pagination'
import {seoProperty} from '../../constants/seo-url'
import {
  useCommonAccesibility,
  usePagination,
  useSelectUrlParams,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import {ICourierMapping, ISelectOption, IUrlParams} from '../../interface'
import {GlobalContext} from '../../store/GlobalContext'
import {
  PERMISSIONS,
  ROUTE_COURIER_MAPPINGS,
  ROUTE_PARAMS,
} from '../../constants'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import MappingService from '../../services/MappingService'
import {transformToSelectData} from '../../helpers/select'
import {decodeParam, getURLParamsObj} from '../../helpers'
import CourierMappingsService from '../../services/CourierMappingsService'
import {AddButton} from '../../components'
import Searching from '../../components/Searching'

const ListCourierMappings = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [courierMappings, setCourierMappings] = useState<ICourierMapping[]>([])
  const [marketplaceTypeOptions, setMarketplaceTypeOptions] = useState<
    ISelectOption[]
  >([])
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(
      useSelectUrlParams(
        ['marketplaceTypeLabel', 'marketplaceTypeValue'],
        'marketplaceType'
      )
    )
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  useCommonAccesibility()

  const templateLamda = TemplatePaginator('sample_lamda')

  const {
    state: {
      pagesInfo: {
        courierMappings: {
          searchData: {selectedMarketplaceType: selectedMarketplaceTypeStored},
        },
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {
    dataApi: {keyword, pagination, axiosClient, defaultPagination},
    dataTable: {
      totalRecords,
      setTotalRecords,
      onSearch,
      onKeywordChange,
      setKeyword,
      onBlurInputSearch,
      setPagination,
      onSort,
      onPage,
    },
  } = usePagination(courierMappingsTablePaginationPerPage, true)

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount(searchCount + 1)
    onSearch()
  }

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const handleFilterChange = (option: SingleValue<ISelectOption>) => {
    setSelectedMarketplaceType(option)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      marketplaceTypeLabel: option?.label,
      marketplaceTypeValue: option?.value,
    })
  }

  const handleSelectionChange = (e: DataTableSelectionChangeParams) => {
    navigate(
      ROUTE_COURIER_MAPPINGS.EDIT.replace(
        ROUTE_PARAMS.COURIER_MAPPING_ID,
        e.value.id
      ),
      {
        state: {
          viewlistLocation: location,
        },
      }
    )
  }

  const refreshInitialState = () => {
    setKeyword('')
    pagination &&
      setPagination({
        ...defaultPagination,
        sortField: pagination.sortField,
        sortOrder: pagination.sortOrder,
        rows: 10,
      })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  const onClearCurrentFilters = () => {
    setCurrentStatus(null)
    setSelectedURLParamsObj({
      ..._.omit(selectedURLParamsObj, ['currentStatus', 'search']),
    })
    setKeyword('')
    setSelectedMarketplaceType(null)
    setCourierMappings([])
    setTotalRecords(0)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_COURIER_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType: null,
      },
    })
  }

  const onGetFiltersCourierMappingsData = () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_COURIER_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType,
      },
    })
  }

  const bindingCourierMappings = (response: any) => {
    setCourierMappings(response.data.content)
    setTotalRecords(response.data.totalElements)
  }

  const handleGetCourierMappingsUsedSearchData = () => {
    new CourierMappingsService(axiosClient)
      .filterCourierMappings(
        {
          ...pagination,
        },
        {
          marketplaceTypeId: selectedMarketplaceTypeStored
            ? selectedMarketplaceTypeStored.value
            : null,
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingCourierMappings(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  useEffect(() => {
    new MappingService(axiosClient)
      .getAllMappingMarketplaces()
      .then((response) => {
        setMarketplaceTypeOptions(transformToSelectData(response.data))
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

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
    if (
      pagination &&
      currentStatus === 'apply' &&
      selectedMarketplaceTypeStored !== null
    ) {
      handleGetCourierMappingsUsedSearchData()
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === 'search' &&
      selectedMarketplaceTypeStored !== null
    ) {
      handleGetCourierMappingsUsedSearchData()
    }
  }, [pagination, currentStatus, searchCount])

  usePreviousPage('apps-courier-mappings', {})

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
      className='p-button-text'
      onClick={refreshInitialState}
      tooltip={t('common_button_refresh_table')}
    />
  )

  const paginatorRight = (
    <AddButton
      onClick={() =>
        navigate(ROUTE_COURIER_MAPPINGS.ADD, {
          state: {
            viewlistLocation: location,
          },
        })
      }
      permissions={[PERMISSIONS.add_courier_mapping]}
      label={t('courier_mappings_paginator_add_courier_mapping')}
    />
  )

  return (
    <>
      <SeoConfig seoProperty={seoProperty.courierMappings} />
      <Row>
        <PageTitle title={t('courier_mappings_page_title')} />
        <Col xs={12}>
          <Card>
            <Card.Body style={{border: 'none'}}>
              <Accordion
                defaultActiveKey={
                  decodeParam('collapse', searchParams) || 'filter-accordion'
                }
                id='accordion'
                className='custom-accordion'
              >
                <div className='d-flex align-items-center'>
                  <CustomToggle
                    eventKey='filter-accordion'
                    containerClass=''
                    style={{marginRight: '0.5rem'}}
                    linkClass=''
                    name='courierMappings'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('courier_mappings_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='marketplace-type'>
                          {t('courier_mappings_filter_marketplace_type_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={marketplaceTypeOptions}
                          placeholder={t(
                            'courier_mappings_filter_marketplace_type_placeHolder'
                          )}
                          isSearchable
                          onChange={(value) => handleFilterChange(value)}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaceType}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={10} className='text-center'>
                        <Button
                          className='me-2'
                          variant='danger'
                          onClick={onClearCurrentFilters}
                        >
                          {t('common_button_reset_label')}
                        </Button>
                        <Button
                          variant='success'
                          onClick={onGetFiltersCourierMappingsData}
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
          paginator
          paginatorTemplate={templateLamda}
          value={courierMappings}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          onSelectionChange={handleSelectionChange}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(courierMappings)
              ? t('courier_mappings_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
          resizableColumns
          columnResizeMode='fit'
        >
          <Column
            header={t('courier_mappings_table_header_column_courier')}
            field='mmsValue'
            sortField='mmsValue'
            sortable
            body={(data: ICourierMapping) => (
              <FieldTextDataTable value={data.mmsValue} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t(
              'courier_mappings_table_header_column_marketplace_courier'
            )}
            field='marketplaceValue'
            sortField='marketplaceValue'
            sortable
            body={(data: ICourierMapping) => (
              <FieldTextDataTable
                value={data.marketplaceValue}
                placement='bottom'
              />
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default ListCourierMappings
