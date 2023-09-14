import {useContext, useEffect, useState} from 'react'
import Select, {MultiValue} from 'react-select'
import {Accordion, Button, Card, Col, Container, Row} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {useTranslation} from 'react-i18next'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import {omit, isEmpty} from 'lodash'
import Searching from '../../components/Searching'
import SeoConfig from '../../components/SEO/SEO-Component'
import {
  defaultAllDatasByErpIdPagination,
  defaultPropertyValuesTablePaginationPerPage,
} from '../../constants/pagination'
import {seoProperty} from '../../constants/seo-url'
import {
  useCommonAccesibility,
  usePagination,
  useSelectUrlParams,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import {GlobalContext} from '../../store/GlobalContext'
import {
  PERMISSIONS,
  ROUTE_DEFAULT_PROPERTY_VALUE,
  ROUTE_PARAMS,
} from '../../constants'
import {TemplatePaginator} from '../../components/Paginator'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import DefaultPropertyValueService from '../../services/DefaultPropertyValueService'
import {
  IDefaultPropertyValue,
  IDefaultProperty,
} from '../../interface/defaultPropertyValue'
import {IDefaultPropertyLocation} from '../../interface/location'
import PageTitle from '../../components/PageTitle/PageTitle'
import CustomToggle from '../../components/CustomToggle'
import {ISelectOption} from '../../interface/selectOption'
import OrganizationServices from '../../services/OrganizationService'
import {transformToSelectData} from '../../helpers/select'
import SiteLocaleService from '../../services/SiteLocaleService'
import {formatDateNoHours} from '../../utils'
import {decodeParam, getURLParamsObj} from '../../helpers'
import {IUrlParams} from '../../interface'
import {AddButton} from '../../components'

export default function DefaultPropertyValues() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as IDefaultPropertyLocation
  const [searchParams, setSearchParams] = useSearchParams()
  const [defaultPropertyValues, setDefaultPropertyValues] = useState<
    IDefaultPropertyValue[]
  >([])
  const [originalProperties, setOriginalProperties] = useState<
    IDefaultProperty[]
  >([])

  const [selectOrganizationOptions, setSelectOrganizationOptions] = useState<
    ISelectOption[]
  >([])
  const [selectPropertyOptions, setSelectPropertyOptions] = useState<
    ISelectOption[]
  >([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<
    ISelectOption[]
  >([])

  const [selectedOrganizations, setSelectedOrganizations] = useState<
    ISelectOption[]
  >(useSelectUrlParams(['orgLs', 'orgVs'], 'org'))
  const [selectedProperties, setSelectedProperties] = useState<ISelectOption[]>(
    useSelectUrlParams(['propertyLabels', 'propertyValues'], 'property')
  )
  const [selectedLocales, setSelectedLocales] = useState<ISelectOption[]>(
    useSelectUrlParams(['localeLs', 'localeVs'], 'locale')
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )
  const [countLoadingPage, setCountLoadingPage] = useState<number>(0)
  
  const {
    state: {
      axiosClient,
      pagesInfo: {
        defaultPropertyValue: {searchData},
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
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
  } = usePagination(defaultPropertyValuesTablePaginationPerPage, true)

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

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
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

  const bindingData = (response: any) => {
    const data = response.data.content.map((x: IDefaultPropertyValue) => {
      const type = originalProperties.find(
        (p: IDefaultProperty) => p.id === x.propertyId
      )?.type
      return {
        ...x,
        localeName: x.localeId ? x.localeName : 'All locales',
        defaultValue:
          type === 'Date' ? formatDateNoHours(x.defaultValue) : x.defaultValue,
      }
    })
    setDefaultPropertyValues(data)
    setTotalRecords(response.data.totalElements)
  }

  const handleFilterChange = (
    options: MultiValue<ISelectOption>,
    type: 'organizations' | 'properties' | 'locales'
  ) => {
    switch (type) {
      case 'organizations': {
        setSelectedOrganizations(options as ISelectOption[])
        if (options.length !== 0) {
          setSelectedURLParamsObj({
            ...selectedURLParamsObj,
            orgLs: options.map((x) => encodeURIComponent(x.label)).toString(),
            orgVs: options.map((x) => encodeURIComponent(x.value)).toString(),
          })
        } else {
          setSelectedURLParamsObj({
            ...omit(selectedURLParamsObj, ['orgLs', 'orgVs']),
          })
        }
        break
      }
      case 'properties': {
        setSelectedProperties(options as ISelectOption[])
        if (options.length !== 0) {
          setSelectedURLParamsObj({
            ...selectedURLParamsObj,
            propertyLabels: options
              .map((x) => encodeURIComponent(x.label))
              .toString(),
            propertyValues: options
              .map((x) => encodeURIComponent(x.value))
              .toString(),
          })
        } else {
          setSelectedURLParamsObj({
            ...omit(selectedURLParamsObj, ['propertyLabels', 'propertyValues']),
          })
        }
        break
      }
      case 'locales': {
        setSelectedLocales(options as ISelectOption[])
        if (options.length !== 0) {
          setSelectedURLParamsObj({
            ...selectedURLParamsObj,
            localeLs: options
              .map((x) => encodeURIComponent(x.label))
              .toString(),
            localeVs: options
              .map((x) => encodeURIComponent(x.value))
              .toString(),
          })
        } else {
          setSelectedURLParamsObj({
            ...omit(selectedURLParamsObj, ['localeLs', 'localeVs']),
          })
        }
        break
      }
      default:
    }
  }

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
    />
  )

  const paginatorRight = (
    <AddButton
      onClick={() => redirectToAddDefaultPropertyValuePage()}
      permissions={[PERMISSIONS.add_default_property_value]}
      label={t('default_property_value_add_default_property_value')}
    />
  )

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    navigate(
      ROUTE_DEFAULT_PROPERTY_VALUE.EDIT.replace(
        ROUTE_PARAMS.DEFAULT_PROPERTY_VALUE_ID,
        e.value.id
      ),
      {
        state: {
          viewlistLocation: location,
        },
      }
    )
  }

  const redirectToAddDefaultPropertyValuePage = () => {
    navigate(ROUTE_DEFAULT_PROPERTY_VALUE.ADD, {
      state: {
        viewlistLocation: location,
      },
    })
  }

  const onClearCurrentFilters = () => {
    setCurrentStatus(null)
    setSelectedOrganizations([])
    setSelectedProperties([])
    setSelectedLocales([])
    setSelectedURLParamsObj({
      ...omit(selectedURLParamsObj, [
        'search',
        'currentStatus',
        'orgVs',
        'orgLs',
        'propertyValues',
        'propertyLabels',
        'localeLs',
        'localeVs',
      ]),
    })
    setKeyword('')
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_DEFAULT_PROPERTY_VALUE_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations: [],
        selectedProperties: [],
        selectedLocales: [],
      },
    })
  }

  const onGetFiltersProductsData = async () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_DEFAULT_PROPERTY_VALUE_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations,
        selectedProperties,
        selectedLocales,
      },
    })
  }

  const getOrganizations = () => {
    new OrganizationServices(axiosClient)
      .getAllOrganizations({
        ...omit(defaultAllDatasByErpIdPagination, [
          'first',
          'keyword',
          'sortField',
          'sortOrder',
        ]),
        isReviewProduct: false,
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
  }

  const getProperties = () => {
    new DefaultPropertyValueService(axiosClient)
      .filterProperties(
        {
          ...defaultAllDatasByErpIdPagination,
        },
        {search: ''}
      )
      .then((response: any) => {
        setOriginalProperties(response.data.content)
        setSelectPropertyOptions(transformToSelectData(response.data.content))
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getLocales = () => {
    new SiteLocaleService(axiosClient)
      .getLocalesList()
      .then((response: any) => {
        const options = response.data.map((x: any) => ({
          value: x.id,
          label: x.name,
        }))
        setSelectLocaleOptions(options)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const templateLamda = TemplatePaginator('sample_lamda')

  const handleGetDefaultPropertyUsedSearchData = () => {
    new DefaultPropertyValueService(axiosClient)
      .fetchAllDefaultPropertyValues(pagination, {
        search: keyword,
        localeIds: searchData.selectedLocales
          ? searchData.selectedLocales.map((lc: any) => lc.value)
          : [],
        organizationIds: searchData.selectedOrganizations
          ? searchData.selectedOrganizations.map((org: any) => org.value)
          : [],
        propertyIds: searchData.selectedProperties
          ? searchData.selectedProperties.map((pt: any) => pt.value)
          : [],
      })
      .then((response: any) => {
        bindingData(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  useEffect(() => {
    getOrganizations()
    getProperties()
    getLocales()
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
      currentStatus === 'apply' &&
      pagination &&
      !isEmpty(originalProperties)
    ) {
      handleGetDefaultPropertyUsedSearchData()
    }
  }, [pagination, filterCount, currentStatus, originalProperties])

  useEffect(() => {
    currentStatus === 'search' &&
      pagination &&
      !isEmpty(originalProperties) &&
      handleGetDefaultPropertyUsedSearchData()
  }, [pagination, searchCount, currentStatus, originalProperties])

  useEffect(() => {
    if (!currentStatus && pagination && !isEmpty(originalProperties)) {
      new DefaultPropertyValueService(axiosClient)
        .fetchAllDefaultPropertyValues(pagination, {
          search: '',
          localeIds: [],
          organizationIds: [],
          propertyIds: [],
        })
        .then((response: any) => {
          bindingData(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, currentStatus, originalProperties])

  useCommonAccesibility()

  usePreviousPage('apps-default-property-values', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.defaultPropertyValues}></SeoConfig>
      <Row>
        <PageTitle title={t('default_property_value_title')} />
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
                    name='defaultPropertyValue'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('default_property_value_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organizations'>
                          {t(
                            'default_property_value_filter_organization_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          name='organizations'
                          options={selectOrganizationOptions}
                          placeholder={t(
                            'default_property_values_filter_organization_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'organizations')
                          }
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedOrganizations}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='property'>
                          {t('default_property_value_filter_property_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          name='property'
                          options={selectPropertyOptions}
                          placeholder={t(
                            'default_property_value_filter_property_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'properties')
                          }
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedProperties}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='locale'>
                          {t('default_property_value_filter_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          name='locale'
                          options={selectLocaleOptions}
                          placeholder={t(
                            'default_property_value_filter_locale_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={(value) =>
                            handleFilterChange(value, 'locales')
                          }
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedLocales}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={8} className='text-center'>
                        <Button
                          className='me-2'
                          variant='danger'
                          onClick={onClearCurrentFilters}
                        >
                          {t('common_button_reset_label')}
                        </Button>
                        <Button
                          variant='success'
                          onClick={onGetFiltersProductsData}
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
          sortField={pagination?.sortField}
          sortOrder={pagination?.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={defaultPropertyValues}
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
          emptyMessage={t('default_property_value_table_empty_message')}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            sortField='organizationName'
            header={t('default_property_value_table_organization')}
            sortable
            body={(item: IDefaultPropertyValue) => (
              <FieldTextDataTable
                value={item.organizationName}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            sortField='propertyName'
            header={t('default_property_value_table_property')}
            sortable
            body={(item: IDefaultPropertyValue) => (
              <FieldTextDataTable
                value={item.propertyName}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            sortField='localeName'
            header={t('default_property_value_table_locale')}
            sortable
            body={(item: IDefaultPropertyValue) => (
              <FieldTextDataTable
                value={item.localeName ? item.localeName : 'All locales'}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            sortField='defaultValue'
            header={t('default_property_value_table_default_value')}
            sortable
            body={(item: IDefaultPropertyValue) => (
              <FieldTextDataTable
                value={item.defaultValue}
                placement='bottom'
              />
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
