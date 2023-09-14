import {
  DataTable,
  DataTableSortOrderType,
  DataTableSelectionChangeParams,
} from 'primereact/datatable'
import {useContext, useEffect, useRef, useState} from 'react'
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap'
import {Button as ButtonPrime} from 'primereact/button'
import {useTranslation} from 'react-i18next'
import Select, {SingleValue} from 'react-select'
import {Column} from 'primereact/column'
import _ from 'lodash'
import classNames from 'classnames'
import {
  useLocation,
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import CustomToggle from '../../components/CustomToggle'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  useCommonAccesibility,
  usePagination,
  usePersistLocationState,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import {
  ICustomLocation,
  IMarketplaceProductCategory,
  IMarketplaceType,
  IProductPropertyMappings,
  IProductPropertyMappingsState,
  ISelectOption,
  IUrlParams,
} from '../../interface'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import MappingService from '../../services/MappingService'
import {
  transformToSelectData,
  getSortOrder,
  getCurrentStatus,
  renderUnitType,
  getURLParamsObj,
} from '../../helpers'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import {GlobalContext} from '../../store/GlobalContext'
import ProductPropertyMappingsService from '../../services/ProductPropertyMappingsService'
import {productPropertyMappingsTablePaginationPerPage} from '../../constants/pagination'
import {ROUTE_PRODUCT_PROPERTY_MAPPINGS, ROUTE_PARAMS} from '../../constants'
import BreadCrumb from '../../components/BreadCrumb'
import PageTitle from '../../components/PageTitle/PageTitle'
import Searching from '../../components/Searching'

export default function ListProductCategoryMappings() {
  const {t} = useTranslation()
  const {productCategoryMappingsId, marketplaceTypeId, mappingTargetId} =
    useParams()
  const location =
    useLocation() as ICustomLocation<IProductPropertyMappingsState>
  const {state: persistState} = usePersistLocationState(location)
  const navigate = useNavigate()
  const [productPropertyMappings, setProductPropertyMappings] = useState<
    IProductPropertyMappings[]
  >([])
  const [marketplaceTypeOptions, setMarketplaceTypeOptions] = useState<
    ISelectOption[]
  >([])
  const selectMarketplaceTypeRef = useRef<any>()
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(
      location.state?.selectedMarketplaceType || null
    )
  const [
    marketplaceProductCategoryOptions,
    setMarketplaceProductCategoryOptions,
  ] = useState<ISelectOption[]>([])
  const selectMarketplaceProductCategoryRef = useRef<any>()
  const [
    selectedMarketplaceProductCategory,
    setSelectedMarketplaceProductCategory,
  ] = useState<ISelectOption | null>(
    location.state?.selectedMarketplaceProductCategory || null
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [, setSearchParams] = useSearchParams()

  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<'apply' | 'search' | null>(
    getCurrentStatus(location)
  )
  const [sortField, setSortField] = useState<string>('attributeResponse.value')
  const [sortOrder, setSortOrder] = useState<DataTableSortOrderType>(1)

  const {
    state: {
      accordion,
      pagesInfo: {
        productPropertyMappings: {searchData},
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  useCommonAccesibility()

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
    },
  } = usePagination(productPropertyMappingsTablePaginationPerPage, true)

  const onClearCurrentFilters = () => {
    selectMarketplaceTypeRef.current.clearValue()
    selectMarketplaceProductCategoryRef.current.clearValue()
    setCurrentStatus(null)
    setKeyword('')
    setSelectedMarketplaceType(null)
    setSelectedMarketplaceProductCategory(null)
    setProductPropertyMappings([])
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType: null,
        selectedMarketplaceProductCategory: null,
      },
    })
  }

  const onGetFiltersProductPropertyMappingsData = () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType,
        selectedMarketplaceProductCategory,
      },
    })
  }

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSearchCount(searchCount + 1)
    onSearch()
  }

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const handleFilterChange = (
    option: SingleValue<ISelectOption>,
    type: 'marketplaceType' | 'marketplaceProductCategory'
  ) => {
    switch (type) {
      case 'marketplaceType':
        setSelectedMarketplaceType(option)
        setSelectedMarketplaceProductCategory(null)
        if (option) {
          getMarketplaceProductCategories(option.value)
        }
        break
      case 'marketplaceProductCategory':
        setSelectedMarketplaceProductCategory(option)
        break
      default:
    }
  }

  const refreshInitialState = () => {
    setKeyword('')
    pagination &&
      setPagination({
        ...defaultPagination,
        sortField,
        sortOrder,
        rows: 10,
      })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  const bindingProductPropertyMappings = (data: any) => {
    setProductPropertyMappings(data)
    setTotalRecords(data.length)
  }

  const getMarketplaceProductCategories = (
    mtId: string,
    callback?: (options: IMarketplaceProductCategory[]) => void
  ) => {
    new ProductPropertyMappingsService(axiosClient)
      .getMarketplaceProductCategories(mtId)
      .then((response) => {
        const options = response.data.map((x: IMarketplaceProductCategory) => {
          return {
            value: x.id,
            label: x.marketplaceValue,
          }
        })

        setMarketplaceProductCategoryOptions(options)

        if (callback) {
          callback(response.data)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetProductPropertyMappingsUsedSearchData = (
    shouldSortDefault: boolean = false
  ) => {
    new ProductPropertyMappingsService(axiosClient)
      .filterProductPropertyMappings({
        marketplaceTypeId: searchData.selectedMarketplaceType
          ? searchData.selectedMarketplaceType.value
          : null,
        mappingTargetId: searchData.selectedMarketplaceProductCategory
          ? searchData.selectedMarketplaceProductCategory.value
          : null,
        search: keyword,
      })
      .then((response: any) => {
        if (shouldSortDefault) {
          const orderedData = onDefaultSort(response.data)
          bindingProductPropertyMappings(orderedData)
        } else {
          const orderredData = _.orderBy(
            response.data,
            sortField,
            getSortOrder(sortOrder)
          )
          bindingProductPropertyMappings(orderredData)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleSelection = (e: DataTableSelectionChangeParams) => {
    if (!e.value.propertyResponse) {
      return
    }
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_SELECTED_PRODUCT_PROPERTY_MAPPING,
      payload: {
        selectedMarketplaceTypeName: selectedMarketplaceType?.label,
        selectedMarketplaceProductProperty: e.value.attributeResponse.value,
        selectedMMSProductProperty: e.value.mappingResponse.mmsValue,
      },
    })
    navigate(
      ROUTE_PRODUCT_PROPERTY_MAPPINGS.EDIT.replace(
        ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID,
        productCategoryMappingsId || ''
      )
        .replace(
          ROUTE_PARAMS.MARKETPLACE_TYPE_ID,
          e.value.attributeResponse.marketplaceTypeId || ''
        )
        .replace(
          ROUTE_PARAMS.MAPPING_TARGET_ID,
          searchData.selectedMarketplaceProductCategory?.value || ''
        )
        .replace(
          ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID,
          e.value.mappingResponse.id
        ),
      {
        state: {
          selectedMarketplaceTypeName: selectedMarketplaceType?.label,
          // selectedMarketplaceProductProperty: e.value.attributeResponse.value,
          selectedMarketplaceType,
          selectedMarketplaceProductCategory,
          eventKey: accordion.productPropertyMappings || '0',
          currentStatus,
        },
      }
    )
  }

  const onCustomSort = (event: any) => {
    // pagination &&
    //   setPagination({
    //     ...pagination,
    //     sortField: event.sortField,
    //     sortOrder: event.sortOrder,
    //   })
    const order = getSortOrder(event.sortOrder)
    if (event.sortField === 'attributeResponse.value') {
      const orderredData = _.orderBy(
        productPropertyMappings,
        (p) => {
          return p.attributeResponse.value
        },
        order
      )
      setProductPropertyMappings(orderredData)
    } else {
      const orderredData = _.orderBy(
        productPropertyMappings,
        (p) => {
          return p.attributeResponse.isMandatory
        },
        order
      )
      setProductPropertyMappings(orderredData)
    }
    setSortField(event.sortField)
    setSortOrder(event.sortOrder)
  }

  const onDefaultSort = (data: any) => {
    const orderredData = _.orderBy(
      data,
      (p) => {
        return p.attributeResponse.value
      },
      'asc'
    )
    return orderredData
  }

  useEffect(() => {
    new MappingService(axiosClient)
      .getAllMappingMarketplaces()
      .then((response) => {
        setMarketplaceTypeOptions(transformToSelectData(response.data))
        if (marketplaceTypeId) {
          const marketplaceType = response.data.find(
            (x: IMarketplaceType) => x.id === marketplaceTypeId
          )
          setSelectedMarketplaceType({
            label: marketplaceType.name,
            value: marketplaceType.id,
          })
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (marketplaceTypeId && mappingTargetId) {
      getMarketplaceProductCategories(
        marketplaceTypeId,
        (data: IMarketplaceProductCategory[]) => {
          const marketplaceProductCategory = data.find(
            (x) => x.id === mappingTargetId
          )
          if (marketplaceProductCategory) {
            const option = {
              value: marketplaceProductCategory.id,
              label: marketplaceProductCategory.marketplaceValue,
            }
            setSelectedMarketplaceProductCategory(option)
            pagesInfoDispatch({
              type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA,
              payload: {
                selectedMarketplaceType: {
                  value: marketplaceTypeId,
                  label: '',
                },
                selectedMarketplaceProductCategory: option,
              },
            })
          }
        }
      )
    } else {
      setSelectedMarketplaceProductCategory(null)
      setSelectedMarketplaceType(null)
      pagesInfoDispatch({
        type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA,
        payload: {
          selectedMarketplaceType: null,
          selectedMarketplaceProductCategory: null,
        },
      })
      setProductPropertyMappings([])
      setFilterCount(0)
      setSearchCount(0)
      setCurrentStatus(null)
      setSortField('attributeResponse.value')
      setSortOrder(1)
    }
  }, [marketplaceTypeId, mappingTargetId])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === null &&
      marketplaceTypeId &&
      mappingTargetId
    ) {
      new ProductPropertyMappingsService(axiosClient)
        .filterProductPropertyMappings({
          marketplaceTypeId,
          mappingTargetId,
          search: keyword,
        })
        .then((response: any) => {
          const orderedData = onDefaultSort(response.data)
          bindingProductPropertyMappings(orderedData)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === 'apply' &&
      searchData.selectedMarketplaceType &&
      searchData.selectedMarketplaceProductCategory
    ) {
      handleGetProductPropertyMappingsUsedSearchData(true)
    }
  }, [
    pagination,
    filterCount,
    currentStatus,
    location,
    searchData.selectedMarketplaceType,
    searchData.selectedMarketplaceProductCategory,
  ])

  useEffect(() => {
    if (pagination && currentStatus === 'search') {
      handleGetProductPropertyMappingsUsedSearchData()
    }
  }, [pagination, currentStatus, searchCount])

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

  usePreviousPage('apps-product-property-mappings', {})

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
              setSearchCount={setSearchCount}
              searchCount={searchCount}
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

  const generateLinkAddMapping = (data: IProductPropertyMappings) => {
    if (marketplaceTypeId && mappingTargetId) {
      return (
        <Link
          to={`${location.pathname}/add`}
          state={{
            marketplaceValue: data.attributeResponse.value,
            marketplaceTypeId: data.attributeResponse.marketplaceTypeId,
            marketplaceCode: data.attributeResponse.marketplaceCode,
            selectedMarketplaceType,
            selectedMarketplaceProductCategory,
            eventKey: accordion.productPropertyMappings || '0',
            currentStatus,
          }}
        >
          {t('product_property_mappings_add_mapping_link')}
        </Link>
      )
    }
    const to = `${location.pathname}/${selectedMarketplaceType?.value}/${selectedMarketplaceProductCategory?.value}/add`
    return (
      <Link
        to={to}
        state={{
          marketplaceValue: data.attributeResponse.value,
          marketplaceTypeId: data.attributeResponse.marketplaceTypeId,
          marketplaceCode: data.attributeResponse.marketplaceCode,
          selectedMarketplaceType,
          selectedMarketplaceProductCategory,
          eventKey: accordion.productPropertyMappings || '0',
          currentStatus,
        }}
      >
        {t('product_property_mappings_add_mapping_link')}
      </Link>
    )
  }

  return (
    <>
      <SeoConfig seoProperty={seoProperty.productPropertyMappings}></SeoConfig>
      <Row>
        <BreadCrumb
          origin='productCategoryMapping'
          breadCrumbItems={[
            {label: t('product_property_mappings_page_title'), active: true},
          ]}
          persistState={
            persistState && _.has(persistState, 'selectedMarketplaceTypeName')
              ? null
              : persistState
          }
        />
        <PageTitle title={t('product_property_mappings_page_title')} />
        <Col xs={12}>
          <Card>
            <Card.Body style={{border: 'none'}}>
              <Accordion
                defaultActiveKey='filter-accordion'
                id='accordion'
                className='custom-accordion'
              >
                <div className='d-flex align-items-center'>
                  <CustomToggle
                    eventKey='filter-accordion'
                    containerClass=''
                    style={{marginRight: '0.5rem'}}
                    linkClass=''
                    name='productPropertyMappings'
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('product_property_mappings_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='marketplace-type'>
                          {t(
                            'product_property_mappings_filter_marketplace_type_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={marketplaceTypeOptions}
                          placeholder={t(
                            'product_property_mappings_filter_marketplace_type_placeHolder'
                          )}
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'marketplaceType')
                          }
                          ref={selectMarketplaceTypeRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaceType}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='marketplace-product-category'>
                          {t(
                            'product_property_mappings_filter_marketplace_product_category_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={marketplaceProductCategoryOptions}
                          placeholder={t(
                            'product_property_mappings_filter_marketplace_product_category_placeHolder'
                          )}
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(
                              value,
                              'marketplaceProductCategory'
                            )
                          }
                          ref={selectMarketplaceProductCategoryRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaceProductCategory}
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
                          onClick={onGetFiltersProductPropertyMappingsData}
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
          sortField={sortField}
          sortOrder={sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          paginator
          paginatorTemplate={''}
          value={productPropertyMappings}
          first={pagination && pagination.first}
          rows={totalRecords}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(productPropertyMappings)
              ? t('product_property_mappings_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onCustomSort}
          resizableColumns
          columnResizeMode='fit'
          onSelectionChange={(e) => handleSelection(e)}
        >
          <Column
            header={t(
              'product_property_mappings_table_header_column_marketplace_product_property'
            )}
            field='attributeResponse.value'
            sortField='attributeResponse.value'
            sortable
            body={(data: IProductPropertyMappings) => (
              <div style={{display: 'flex'}}>
                <div>{data.attributeResponse.value} {renderUnitType(data.attributeResponse.value)}</div>
                {Boolean(data.attributeResponse.isEnum) && (
                  <Badge
                    as={'span'}
                    className={classNames('me-1', 'bg-success')}
                    style={{marginLeft: '12px'}}
                  >
                    {t('product_property_mappings_value_list')}
                  </Badge>
                )}
              </div>
            )}
          ></Column>
          <Column
            header={t(
              'product_property_mappings_table_header_column_is_mandatory'
            )}
            field='attributeResponse.isMandatory'
            sortField='attributeResponse.isMandatory'
            sortable
            body={(data: IProductPropertyMappings) => (
              <FieldTextDataTable
                value={data.attributeResponse.isMandatory ? 'Yes' : 'No'}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t(
              'product_property_mappings_table_header_column_mms_product_property'
            )}
            field='propertyResponse.name'
            body={(data: IProductPropertyMappings) =>
              data.propertyResponse ? (
                <FieldTextDataTable
                  value={data.propertyResponse.name}
                  placement='bottom'
                />
              ) : (
                generateLinkAddMapping(data)
              )
            }
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
