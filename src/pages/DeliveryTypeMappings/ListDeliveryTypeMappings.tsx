import {Accordion, Button, Card, Col, Container, Row} from 'react-bootstrap'
import {Button as ButtonPrime} from 'primereact/button'
import {useTranslation} from 'react-i18next'
import {useNavigate, useSearchParams, useLocation} from 'react-router-dom'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {useContext, useEffect, useState} from 'react'
import _ from 'lodash'
import {Column} from 'primereact/column'
import Select, {SingleValue} from 'react-select'
import {
  PERMISSIONS,
  ROUTE_DELIVERY_TYPE_MAPPINGS,
  ROUTE_PARAMS,
} from '../../constants'
import {
  useCommonAccesibility,
  useHandleError,
  usePagination,
  useSelectUrlParams,
  usePreviousPage
} from '../../hooks'
import {deliveryTypeMappingsTablePaginationPerPage} from '../../constants/pagination'
import {TemplatePaginator} from '../../components/Paginator'
import {GlobalContext} from '../../store/GlobalContext'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import PageTitle from '../../components/PageTitle/PageTitle'
import CustomToggle from '../../components/CustomToggle/CustomToggle'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import MappingService from '../../services/MappingService'
import {
  decodeParam,
  getURLParamsObj,
  transformToSelectData,
} from '../../helpers'
import {IDeliveryTypeMapping, ISelectOption, IUrlParams} from '../../interface'
import DeliveryService from '../../services/DeliveryService'
import {AddButton} from '../../components'
import Searching from '../../components/Searching'

export default function ListDeliveryTypeMappings() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const {handleErrorResponse} = useHandleError()
  const [deliveryTypeMappings, setDeliveryTypeMappings] = useState<
    IDeliveryTypeMapping[]
  >([])
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
        deliveryTypeMappings: {
          searchData
        },
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

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
  } = usePagination(deliveryTypeMappingsTablePaginationPerPage, true)

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
      ROUTE_DELIVERY_TYPE_MAPPINGS.EDIT.replace(
        ROUTE_PARAMS.DELIVERY_TYPE_MAPPING_ID,
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
      ..._.omit(selectedURLParamsObj, ['currentStatus']),
    })
    setKeyword('')
    setSelectedMarketplaceType(null)
    setDeliveryTypeMappings([])
    setTotalRecords(0)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType: null,
      },
    })
  }

  const onGetFiltersDeliveryTypeMappingsData = () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType,
      },
    })
  }

  const bindingDeliveryTypeMappings = (response: any) => {
    setDeliveryTypeMappings(response.data.content)
    setTotalRecords(response.data.totalElements)
  }

  const handleFilterDeliveryTypeMappingsUsedSearchData = () => {
    new DeliveryService(axiosClient)
      .filterDeliveryTypeMappings(
        {
          ...pagination,
        },
        {
          marketplaceTypeId: searchData && searchData.selectedMarketplaceType
            ? searchData.selectedMarketplaceType.value
            : null,
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingDeliveryTypeMappings(response)
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
      searchData &&
      searchData.selectedMarketplaceType !== null
    ) {
      handleFilterDeliveryTypeMappingsUsedSearchData()
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === 'search' &&
      searchData &&
      searchData.selectedMarketplaceType !== null
    ) {
      handleFilterDeliveryTypeMappingsUsedSearchData()
    }
  }, [pagination, currentStatus, searchCount])

  usePreviousPage('apps-delivery-type-mappings', {})

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
        navigate(ROUTE_DELIVERY_TYPE_MAPPINGS.ADD, {
          state: {
            viewlistLocation: location,
          },
        })
      }
      permissions={[PERMISSIONS.add_delivery_mapping]}
      label={t('delivery_type_mappings_paginator_add_delivery_type_mapping')}
    />
  )

  return (
    <>
      <SeoConfig seoProperty={seoProperty.deliveryTypeMappings} />
      <Row>
        <PageTitle title={t('delivery_type_mappings_page_title')} />
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
                    name='deliveryTypeMappings'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('delivery_type_mappings_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='marketplace-type'>
                          {t(
                            'delivery_type_mappings_filter_marketplace_type_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={marketplaceTypeOptions}
                          placeholder={t(
                            'delivery_type_mappings_filter_marketplace_type_placeHolder'
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
                          onClick={onGetFiltersDeliveryTypeMappingsData}
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
          value={deliveryTypeMappings}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          onSelectionChange={handleSelectionChange}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(deliveryTypeMappings)
              ? t('delivery_type_mappings_table_empty_message')
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
            header={t(
              'delivery_type_mappings_table_header_column_delivery_type'
            )}
            field='mmsValue'
            sortField='mmsValue'
            sortable
            body={(data: IDeliveryTypeMapping) => (
              <FieldTextDataTable value={data.mmsValue} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t(
              'delivery_type_mappings_table_header_column_marketplace_delivery_service'
            )}
            field='marketplaceValue'
            sortField='marketplaceValue'
            sortable
            body={(data: IDeliveryTypeMapping) => (
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
