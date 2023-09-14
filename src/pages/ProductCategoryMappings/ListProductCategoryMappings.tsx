import {useContext, useEffect, useRef, useState} from 'react'
import Select, {SingleValue} from 'react-select'
import _ from 'lodash'
import {Accordion, Button, Card, Col, Container, Row} from 'react-bootstrap'
import {Button as ButtonPrime} from 'primereact/button'
import {useTranslation} from 'react-i18next'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import CustomToggle from '../../components/CustomToggle'
import PageTitle from '../../components/PageTitle/PageTitle'
import {ISelectOption} from '../../interface/selectOption'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import {
  useCommonAccesibility, 
  usePagination, 
  useHandleError, 
  useSelectUrlParams, 
  useCountLoading, 
  usePreviousPage
} from '../../hooks'
import {GlobalContext} from '../../store/GlobalContext'
import {TemplatePaginator} from '../../components/Paginator'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import Searching from '../../components/Searching'
import {
  PERMISSIONS,
  ROUTE_PARAMS,
  ROUTE_PRODUCT_CATEGORY_MAPPINGS,
  ROUTE_PRODUCT_PROPERTY_MAPPINGS,
} from '../../constants'
import {
  IProductCategoryMappings,
  ICustomLocation,
  IUrlParams,
} from '../../interface'
import ProductCategoryMappingsService from '../../services/ProductCategoryMappingsService'
import MappingService from '../../services/MappingService'
import {
  transformToSelectData,
  getURLParamsObj,
  decodeParam,
} from '../../helpers'
import {
  defaultAllDatasByErpIdPagination,
  productCategoryMappingsTablePaginationPerPage,
} from '../../constants/pagination'
import {AddButton} from '../../components'
import OrganizationService from '../../services/OrganizationService'

export const UNMAPPED_PRODUCT_CATEGORIES = 'Un-mapped product categories'

export default function ListProductCategoryMappings() {
  const [productCategoryMappings, setProductCategoryMappings] = useState<
    IProductCategoryMappings[]
  >([])
  const [organizationOptions, setOrganizationOptions] = useState<
    ISelectOption[]
  >([])
  const [mmsProductCategoryOptions, setMmsProductCategoryOptions] = useState<
    ISelectOption[]
  >([])
  const [marketplaceTypeOptions, setMarketplaceTypeOptions] = useState<
    ISelectOption[]
  >([])
  const selectOrganizationRef = useRef<any>()
  const selectMmsProductCategoryRef = useRef<any>()
  const selectMarketplaceTypeRef = useRef<any>()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const location =
    useLocation() as ICustomLocation<any>
  const [selectedOrganization, setSelectedOrganization] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')[0]
  )
  const [selectedMmsProductCategory, setSelectedMmsProductCategory] =
    useState<any>(
      useSelectUrlParams(['pcLs', 'pcVs'], 'productCategory')[0]
    )
  const [selectedMarketplaceType, setSelectedMarketplaceType] = useState<any>(
    useSelectUrlParams(
      ['marketplaceTypeLabel', 'marketplaceTypeValue'],
      'marketplaceType'
    )[0]
  )
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)

  const [searchParams, setSearchParams] = useSearchParams()

  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [countLoadingPage, setCountLoadingPage] = useState<number>(0)

  const {
    state: {
      accordion,
      pagesInfo: {
        productCategoryMappings: {searchData},
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
      onPage,
      onSort,
      onSearch,
      onKeywordChange,
      setKeyword,
      onBlurInputSearch,
      setPagination,
    },
  } = usePagination({
    ...productCategoryMappingsTablePaginationPerPage,
    sortField: decodeParam('sortField', searchParams) || 'mmsValue'
  }, true)

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_CATEGORY_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMmsProductCategory: null,
        selectedMarketplaceType: null,
        selectedOrganization: null,
      },
    })
  }

  const onClearCurrentFilters = () => {
    const mmsValueLabel = selectedMmsProductCategory?.label
    setSelectedOrganization(null)
    setSelectedMmsProductCategory(null)
    setMmsProductCategoryOptions([])
    selectOrganizationRef.current.clearValue()
    selectMmsProductCategoryRef.current.clearValue()
    selectMarketplaceTypeRef.current.clearValue()
    setCountLoadingPage(0)
    setCurrentStatus(null)
    const clearedURLParamsObj = _.omit(selectedURLParamsObj, [
      'search',
      'currentStatus',
      'orgVs',
      'orgLs',
      'pcLs',
      'pcVs',
      'marketplaceTypeValue',
      'marketplaceTypeLabel',
    ])
    setSelectedURLParamsObj({...clearedURLParamsObj})
    setKeyword('')
    setSelectedMmsProductCategory(null)
    setSelectedMarketplaceType(null)
    setSelectedOrganization(null)
    setProductCategoryMappings([])
    setTotalRecords(0)
    if (mmsValueLabel === UNMAPPED_PRODUCT_CATEGORIES) {
      pagination &&
        setPagination({
          ...pagination,
          sortField: 'mmsValue',
        })
    }
    clearSearchData()
  }

  const onGetFiltersProductCategoryMappingsData = () => {
    if (
      _.isEmpty(selectedMmsProductCategory) &&
      _.isEmpty(selectedMarketplaceType)
    ) {
      return
    }
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_CATEGORY_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMmsProductCategory,
        selectedMarketplaceType,
        selectedOrganization
      },
    })
  }

  const onSearchCase = () => {
    setCountLoadingPage(countLoadingPage + 1)
    setCurrentStatus('search')
    setSearchCount(searchCount + 1)
    onSearch()
  }

  const onPageChange = (e: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    onPage(e)
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

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const handleSelectionChange = (e: DataTableSelectionChangeParams) => {
    if (selectedMmsProductCategory?.label === UNMAPPED_PRODUCT_CATEGORIES) {
      navigate(ROUTE_PRODUCT_CATEGORY_MAPPINGS.ADD, {
        state: {
          selectedMmsProductCategory,
          selectedMarketplaceType,
          selectedOrganization,
          eventKey: accordion.productCategoryMappings || '0',
          currentStatus,
          unMappedMmsProductCategory: e.value.mmsValue,
          viewlistLocation: location,
        },
      })
    } else {
      navigate(
        ROUTE_PRODUCT_CATEGORY_MAPPINGS.EDIT.replace(
          ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID,
          e.value.id
        ),
        {
          state: {
            selectedMmsProductCategory,
            selectedMarketplaceType,
            selectedOrganization,
            eventKey: accordion.productCategoryMappings || '0',
            currentStatus,
            viewlistLocation: location,
          },
        }
      )
    }
  }

  const bindingProductCategoryMappings = (response: any) => {
    setProductCategoryMappings(
      response.data.content.map((product: any) => {
        return {
          ...product,
        }
      })
    )
    setTotalRecords(response.data.totalElements)
  }

  const handleGetProductCategoryMappingsUsedSearchData = () => {
    new ProductCategoryMappingsService(axiosClient)
      .filterProductCategoryMappings(
        {
          ...pagination,
          sortField: decodeParam('sortField', searchParams),
        },
        {
          mmsProductCategory: searchData.selectedMmsProductCategory
            ? searchData.selectedMmsProductCategory.label
            : null,
          marketplaceTypeId: searchData.selectedMarketplaceType
            ? searchData.selectedMarketplaceType.value
            : null,
          search: keyword,
          isUnMapped:
            searchData.selectedMmsProductCategory?.label ===
            UNMAPPED_PRODUCT_CATEGORIES,
          organizationId: searchData.selectedOrganization
            ? searchData.selectedOrganization.value
            : null,
        }
      )
      .then((response: any) => {
        bindingProductCategoryMappings(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetProductCategoryMappingsUsedSelectedValues = () => {
    new ProductCategoryMappingsService(axiosClient)
      .filterProductCategoryMappings(
        {
          ...pagination,
          sortField: decodeParam('sortField', searchParams),
        },
        {
          mmsProductCategory: selectedMmsProductCategory
            ? selectedMmsProductCategory.label
            : null,
          marketplaceTypeId: selectedMarketplaceType
            ? selectedMarketplaceType.value
            : null,
          search: keyword,
          isUnMapped:
            selectedMmsProductCategory?.label === UNMAPPED_PRODUCT_CATEGORIES,
          organizationId: selectedOrganization
            ? selectedOrganization.value
            : null,
        }
      )
      .then((response: any) => {
        bindingProductCategoryMappings(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const detectSortFieldBySelectedMmsProductCategory = (
    _selectedMmsProductCategory: any
  ) =>
    _selectedMmsProductCategory.label === UNMAPPED_PRODUCT_CATEGORIES
      ? 'value'
      : 'mmsValue'
  

  const handleUpdateSelectedOrgUrlParams = (selectedValue: any) => {
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        orgLs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        orgVs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['orgLs', 'orgVs']),
      })
  }

  const handleUpdateSelectedProductCategoryUrlParams = (selectedValue: any) => {
    if (selectedValue) {
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        pcLs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        pcVs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
        sortField: detectSortFieldBySelectedMmsProductCategory(selectedValue),
      })
    } else {
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['pcLs', 'pcVs']),
      })
    }
  }

  const handleUpdateSelectedMarketplaceTypeUrlParams = (selectedValue: any) => {
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        marketplaceTypeLabel: [selectedValue]
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        marketplaceTypeValue: [selectedValue]
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, [
          'marketplaceTypeLabel',
          'marketplaceTypeValue',
        ]),
      })
  }

  const handleFilterChange = (
    option: SingleValue<ISelectOption>,
    type: 'mmsProductCategory' | 'marketplaceType' | 'organization'
  ) => {
    setCountLoadingPage(countLoadingPage + 1)
    switch (type) {
      case 'organization':
        setSelectedOrganization(option)
        break
      case 'mmsProductCategory':
        setSelectedMmsProductCategory(option)
        break
      case 'marketplaceType':
        setSelectedMarketplaceType(option)
        break
      default:
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
              searchCount={searchCount}
              setSearchCount={setSearchCount}
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
        navigate(ROUTE_PRODUCT_CATEGORY_MAPPINGS.ADD, {
          state: {
            selectedMmsProductCategory,
            selectedMarketplaceType,
            eventKey: accordion.productCategoryMappings || '0',
            currentStatus,
            viewlistLocation: location,
          },
        })
      }
      permissions={[PERMISSIONS.add_product_category_mapping]}
      label={t('product_category_mappings_paginator_add_category_mapping')}
    />
  )

  useCountLoading(
    countLoadingPage,
    setSearchParams,
    selectedURLParamsObj,
    setSelectedURLParamsObj,
    pagination,
    clearSearchData,
    location
  )

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({...defaultAllDatasByErpIdPagination})
      .then((response: any) => {
        const options = transformToSelectData(response.data.content)
        setOrganizationOptions(options)
        if (options.length === 1) {
          setSelectedOrganization(options[0])
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })

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
    if (countLoadingPage === 0 && !location.state && organizationOptions.length > 1) return
    handleUpdateSelectedOrgUrlParams(selectedOrganization)
    if (selectedOrganization) {
      countLoadingPage !== 0 && setSelectedMmsProductCategory(null)
      new ProductCategoryMappingsService(axiosClient)
        .getProductCategory(selectedOrganization.value)
        .then((response) => {
          const options = response.data.map((x) => ({
            value: x.id,
            label: x.value,
          }))
          options.unshift({
            value: '',
            label: UNMAPPED_PRODUCT_CATEGORIES,
          })
          setMmsProductCategoryOptions(options)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setMmsProductCategoryOptions([])
      setSelectedMmsProductCategory(null)
    }
  }, [selectedOrganization])

  useEffect(() => {
    if (countLoadingPage === 0) return
    handleUpdateSelectedProductCategoryUrlParams(selectedMmsProductCategory)
  }, [selectedMmsProductCategory])

  useEffect(() => {
    if (countLoadingPage === 0) return
    handleUpdateSelectedMarketplaceTypeUrlParams(selectedMarketplaceType)
  }, [selectedMarketplaceType])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === 'apply'
    ) {
      if (!location.state) {
        handleGetProductCategoryMappingsUsedSelectedValues()
      } else {
        handleGetProductCategoryMappingsUsedSearchData()
      }
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (
      pagination &&
      currentStatus === 'search'
    ) {
      if (!location.state) {
        handleGetProductCategoryMappingsUsedSelectedValues()
      } else {
        handleGetProductCategoryMappingsUsedSearchData()
      }
    }
  }, [pagination, currentStatus, searchCount])

  useCommonAccesibility()

  usePreviousPage('apps-product-category-mappings', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.productCategoryMappings}></SeoConfig>
      <Row>
        <PageTitle title={t('product_category_mappings_page_title')} />
        <Col xs={12}>
          <Card>
            <Card.Body style={{border: 'none'}}>
              <Accordion
                defaultActiveKey={decodeParam('collapse', searchParams) || 'filter-accordion'}
                id='accordion'
                className='custom-accordion'
              >
                <div className='d-flex align-items-center'>
                  <CustomToggle
                    eventKey='filter-accordion'
                    containerClass=''
                    style={{marginRight: '0.5rem'}}
                    linkClass=''
                    name='productCategoryMappings'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('product_category_mappings_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='organization'>
                          {t(
                            'product_category_mappings_filter_organization_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={organizationOptions}
                          placeholder={t(
                            'product_category_mappings_filter_organization_placeHolder'
                          )}
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'organization')
                          }
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedOrganization}
                          ref={selectOrganizationRef}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='mms-product-category'>
                          {t(
                            'product_category_mappings_filter_mms_product_category_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={mmsProductCategoryOptions}
                          placeholder={t(
                            'product_category_mappings_filter_mms_product_category_placeHolder'
                          )}
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'mmsProductCategory')
                          }
                          ref={selectMmsProductCategoryRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMmsProductCategory}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={3}>
                        <label htmlFor='marketplace-type'>
                          {t(
                            'product_category_mappings_filter_marketplace_type_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={marketplaceTypeOptions}
                          placeholder={t(
                            'product_category_mappings_filter_marketplace_type_placeHolder'
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
                          onClick={onGetFiltersProductCategoryMappingsData}
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
          value={productCategoryMappings}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          onSelectionChange={handleSelectionChange}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(productCategoryMappings)
              ? t('product_category_mappings_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPageChange}
          resizableColumns
          columnResizeMode='fit'
        >
          <Column
            header={t(
              'product_category_mappings_table_header_column_product_category'
            )}
            field='mmsValue'
            sortField={decodeParam('sortField', searchParams) || undefined}
            sortable
            body={(data: IProductCategoryMappings) => (
              <FieldTextDataTable value={data.mmsValue} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t(
              'product_category_mappings_table_header_column_marketplace_type'
            )}
            field='marketplaceType.name'
            sortField='marketplaceType.name'
            sortable={decodeParam('sortField', searchParams) !== 'value'}
            body={(data: IProductCategoryMappings) => (
              <FieldTextDataTable
                value={data.marketplaceType?.name || ''}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t(
              'product_category_mappings_table_header_column_marketplace_product_category'
            )}
            field='marketplaceValue'
            sortField='marketplaceValue'
            sortable={decodeParam('sortField', searchParams) !== 'value'}
            body={(data: IProductCategoryMappings) => (
              <>
                {data.mappingTarget ? (
                  <Link
                    to={ROUTE_PRODUCT_PROPERTY_MAPPINGS.ROOT.replace(
                      ROUTE_PARAMS.MARKETPLACE_TYPE_ID,
                      data.marketplaceTypeId || ''
                    ).replace(
                      ROUTE_PARAMS.MAPPING_TARGET_ID,
                      data.mappingTarget.id
                    )}
                    state={{
                      selectedMmsProductCategory,
                      selectedMarketplaceType,
                      eventKey: accordion.productCategoryMappings || '0',
                      currentStatus,
                    }}
                  >
                    {data.marketplaceValue}
                  </Link>
                ) : (
                  <FieldTextDataTable
                    value={data.marketplaceValue || ''}
                    placement='bottom'
                  />
                )}
              </>
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
