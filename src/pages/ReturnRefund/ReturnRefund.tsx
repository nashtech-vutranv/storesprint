import {useState, useEffect, useRef, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import _ from 'lodash'
import {DataTable} from 'primereact/datatable'
import {InputText} from 'primereact/inputtext'
import {Container, Row, Col, Button, Card, Accordion} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {useSearchParams, Link} from 'react-router-dom'
import {Button as ButtonPrime} from 'primereact/button'
import {getURLParamsObj, decodeParam} from '../../helpers'
import OrganizationService from '../../services/OrganizationService'
import SiteServices from '../../services/SitesService'
import SiteLocaleService from '../../services/SiteLocaleService'
import AssignedProductService from '../../services/AssignedProductService'
import OrderServices from '../../services/OrderService'
import {getValuesFromOptions, formatDate} from '../../utils'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {TemplatePaginator} from '../../components/Paginator'
import CustomToggle from '../../components/CustomToggle'
import {
  usePagination,
  useCommonAccesibility,
  useSelectUrlParams,
  useHandleError
} from '../../hooks'
import {
  ISelectOption,
  IReturnRefund,
  IReturnsRefunds,
  IUrlParams
} from '../../interface'
import PageTitle from '../../components/PageTitle/PageTitle'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {transformToSelectData} from '../../helpers/select'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import {GlobalContext} from '../../store/GlobalContext'
import {
  defaultTablePaginationSortByErpIdPerPage,
  returnsRefundsTablePaginationPerPage,
  defaultAllDatasByErpIdPagination,
} from '../../constants/pagination'

const ReturnsRefunds = () => {
  const [returnsRefunds, setReturnsRefunds] = useState<IReturnsRefunds>([])
  const {t} = useTranslation()
  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()
  const selectLocaleRef = useRef<any>()
  const selectMarketplaceRef = useRef<any>()
  const selectReturnStatusRef = useRef<any>()
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    state: {
      pagesInfo: {
        returnsrefunds: {searchData},
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
  } = usePagination(returnsRefundsTablePaginationPerPage, true)

  const [selectedOrganizations, setSelectedOrganizations] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')
  )
  const [selectedSites, setSelectedSites] = useState<any>(
    useSelectUrlParams(['siteLs', 'siteVs'], 'site')
  )
  const [selectedLocales, setSelectedLocales] = useState<any>(
    useSelectUrlParams(['localeLs', 'localeVs'], 'locale')
  )

  const [selectedMarketplaces, setSelectedMarketplaces] = useState<
    any
  >(useSelectUrlParams(['mrkLs', 'mrkVs'], 'mrk'))

  const [selectedReturnStatuses, setSelectedReturnStatuses] = useState<any>(
    useSelectUrlParams(['rosLs', 'rosVs'], 'ros'
  ))

  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<any>([])
  const [selectMarketplaceOptions, setSelectMarketplaceOptions] = useState<
    ISelectOption[]
  >([])
  const [selectReturnStatusOptions, setSelectReturnStatusOptions] = useState<
    ISelectOption[]
  >([])
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)

  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )
  const [isSitesSelectFirstLoading, setIsSitesSelectFirstLoading] = useState<boolean>(true)
  const [isLocalesSelectFirstLoading, setIsLocalesSelectFirstLoading] =
    useState<boolean>(true)
  const [isMarketplacesSelectFirstLoading, setIsMarketplacesSelectFirstLoading] = useState<boolean>(true)

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const onGetFiltersProductsData = async () => {
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply'
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_RETURNS_REFUNDS_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations,
        selectedLocales,
        selectedSites,
        selectedMarketplaces,
        selectedReturnStatuses
      },
    })
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    selectSiteRef.current.clearValue()
    selectLocaleRef.current.clearValue()
    selectMarketplaceRef.current.clearValue()
    selectReturnStatusRef.current.clearValue()
    setCurrentStatus(null)
    setSelectedURLParamsObj({
      ..._.omit(selectedURLParamsObj, ['currentStatus'])
    })
    setKeyword('')
    setSelectedOrganizations([])
    setSelectedLocales([])
    setSelectedSites([])
    setSelectedMarketplaces([])
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_RETURNS_REFUNDS_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations: [],
        selectedLocales: [],
        selectedSites: [],
        selectedMarketplaces: [],
        selectedReturnStatuses: [],
      },
    })
  }

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search'
    })
    setSearchCount(searchCount + 1)
    onSearch()
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

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const templateLamda = TemplatePaginator('sample_lamda')

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
              onKeyDown={onPressKeyDown}
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

  const handleChangeOrganizations = (selectedValue: any) => {
    setSelectedOrganizations(selectedValue)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        orgLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        orgVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['orgLs', 'orgVs']),
      })
  }

  const handleChangeSites = (selectedValue: any) => {
    setSelectedSites(selectedValue)
    setIsSitesSelectFirstLoading(false)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        orgLs: selectedURLParamsObj.orgLs,
        orgVs: selectedURLParamsObj.orgVs,
        siteLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        siteVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['siteLs', 'siteVs']),
      })
  }

  const handleChangeLocales = (selectedValue: any) => {
    setSelectedLocales(selectedValue)
    setIsLocalesSelectFirstLoading(false)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        localeLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        localeVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['localeLs', 'localeVs']),
      })
  }

  const handleChangeMarketplaces = (selectedValue: any) => {
    setSelectedMarketplaces(selectedValue)
    setIsMarketplacesSelectFirstLoading(false)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        mrkLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        mrkVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['mrkLs', 'mrkVs']),
      })
  }

  const handleChangeReturnStatuses = (selectedValue: any) => {
    setSelectedReturnStatuses(selectedValue)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        rosLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        rosVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['rosLs', 'rosVs']),
      })
  }

  const transferReturnRefundsWithDateFormat = (data: IReturnsRefunds) => {
    return data.map(item => ({
      ...item,
      modifiedDate: formatDate(item.modifiedDate),
      requestedDate: formatDate(item.requestedDate)
    }))
  }

  const handleFormatReturnRefunds = (_response: any) => {
    setReturnsRefunds(
      transferReturnRefundsWithDateFormat(_response.data.content)
    )
  }

  const getReturnsRefundsData = () => {
    new OrderServices(axiosClient)
      .getReturnsRefunds(
        {
          ..._.omit(pagination, ['keyword']),
        },
        {
          organizationIds: selectedOrganizations.map((org: any) => org.value),
          siteIds: selectedSites.map((site: any) => site.value),
          siteLocaleIds: selectedLocales.map((locale: any) => locale.value),
          marketplaceIds: selectedMarketplaces.map((mrk: any) => mrk.value),
          returnOrderStatuses: selectedReturnStatuses.map((ros: any) => ros.value),
          search: keyword,
        }
      )
      .then((response: any) => {
        handleFormatReturnRefunds(response)
        setTotalRecords(response.data.totalElements)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getReturnsRefundsDataBySearch = () => {
    const {
      selectedOrganizations: selectedOrganizationsBySearch,
      selectedSites: selectedSitesBySearch,
      selectedLocales: selectedLocalesBySearch,
      selectedMarketplaces: selectedMarketplacesBySearch,
      selectedReturnStatuses: selectedReturnStatusesBySearch,
    } = searchData
    new OrderServices(axiosClient)
      .getReturnsRefunds(
        {
          ..._.omit(pagination, ['keyword']),
        },
        {
          organizationIds: selectedOrganizationsBySearch
            ? selectedOrganizationsBySearch.map((org: any) => org.value)
            : [],
          siteIds: selectedSitesBySearch
            ? selectedSitesBySearch.map((site: any) => site.value)
            : [],
          siteLocaleIds: selectedLocalesBySearch
            ? selectedLocalesBySearch.map((locale: any) => locale.value)
            : [],
          marketplaceIds: selectedMarketplacesBySearch
            ? selectedMarketplacesBySearch.map((mrk: any) => mrk.value)
            : [],
          returnOrderStatuses: selectedReturnStatusesBySearch
            ? selectedReturnStatusesBySearch.map((ros: any) => ros.value)
            : [],
          search: keyword,
        }
      )
      .then((response: any) => {
        handleFormatReturnRefunds(response)
        setTotalRecords(response.data.totalElements)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getReturnsRefundsAllData = () => {
    new OrderServices(axiosClient)
      .getReturnsRefunds(
        {
          ..._.omit(pagination, ['keyword']),
        },
        {
        }
      )
      .then((response: any) => {
        handleFormatReturnRefunds(response)
        setTotalRecords(response.data.totalElements)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({
        ...defaultTablePaginationSortByErpIdPerPage,
        rows: 1000,
      })
      .then((response: any) => {
        setSelectOrganizationOptions(
          transformToSelectData(response.data.content)
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    pagination && !currentStatus && getReturnsRefundsAllData()
  }, [currentStatus, pagination])

  useEffect(() => {
    pagination && currentStatus === 'apply' && getReturnsRefundsData()
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    pagination && currentStatus === 'search' && getReturnsRefundsDataBySearch()
  }, [pagination, currentStatus, searchCount])

  useEffect(() => {
    if (!_.isEmpty(selectedOrganizations)) {
      pagination &&
        new SiteServices(axiosClient)
          .getSitesFromMultiOrganizations(
            {
              organizationIds: selectedOrganizations.map(
                (selectedOrg: any) => selectedOrg.value
              ),
            },
            {
              ...defaultAllDatasByErpIdPagination,
              rows: 1000,
            }
          )
          .then((response: any) => {
            setSelectSiteOptions(transformToSelectData(response.data.content))
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
    } else {
      selectSiteRef.current.clearValue()
      setSelectSiteOptions([])
    }
  }, [selectedOrganizations, pagination])

  useEffect(() => {
    if (!_.isEmpty(selectedSites)) {
      new SiteLocaleService(axiosClient)
        .getLocalesFromMultiSites(
          {
            siteIds: selectedSites.map(
              (selectedSite: any) => selectedSite.value
            ),
          },
          {
            ...defaultAllDatasByErpIdPagination,
            rows: 1000,
          }
        )
        .then((response: any) => {
          setSelectLocaleOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      selectLocaleRef.current.clearValue()
      setSelectLocaleOptions([])
    }
  }, [selectedSites])

  useEffect(() => {
    if (!_.isEmpty(selectedLocales)) {
      new AssignedProductService(axiosClient)
        .getAssignedMarketplaces(
          {
            ..._.omit(defaultAllDatasByErpIdPagination, [
              'first',
              'keyword',
              'sortField',
              'sortOrder',
            ]),
            rows: 3000,
          },
          {
            organizationIds: getValuesFromOptions(selectedOrganizations),
            siteLocaleIds: getValuesFromOptions(selectedLocales),
            isReviewProduct: true,
          }
        )
        .then((response: any) => {
          const marketplacesAssignedList = transformToSelectData(
            response.data.content
          )
          setSelectMarketplaceOptions(marketplacesAssignedList)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setSelectMarketplaceOptions([])
      selectMarketplaceRef.current.clearValue()
    }
  }, [selectedLocales])

  useEffect(() => {
    if (!isSitesSelectFirstLoading) {
      const mapSiteOptionValues = selectSiteOptions.map(
        (site: any) => site.value
      )
      setSelectedSites(
        selectedSites.filter((site: any) =>
          mapSiteOptionValues.includes(site.value)
        )
      )
    }
  }, [selectSiteOptions])

  useEffect(() => {
    if (!isLocalesSelectFirstLoading) {
      const mapLocaleOptionValues = selectLocaleOptions.map(
        (locale: any) => locale.value
      )
      setSelectedLocales(
        selectedLocales.filter((locale: any) =>
          mapLocaleOptionValues.includes(locale.value)
        )
      )
    }
  }, [selectLocaleOptions])

  useEffect(() => {
    if (!isMarketplacesSelectFirstLoading) {
      const mapMarketplaceOptionValues = selectMarketplaceOptions.map(
        (marketplace: any) => marketplace.value
      )
      setSelectedMarketplaces(
        selectedMarketplaces.filter((marketplace: any) =>
          mapMarketplaceOptionValues.includes(marketplace.value)
        )
      )
    }
  }, [selectMarketplaceOptions])

  useEffect(() => {
    setSearchParams(selectedURLParamsObj as any)
  }, [selectedURLParamsObj])

  useEffect(() => {
    pagination && setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      search: pagination.keyword,
      page: pagination.page,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder,
      first: pagination.first
    })
  }, [pagination])

  useEffect(() => {
    new OrderServices(axiosClient).getOrderReturnStatuses()
    .then((response: any) => {
      setSelectReturnStatusOptions(response.data.filter((dt: any) => dt !== null).map((item: any) => ({
        label: item,
        value: item
      })))
    })
  }, [])

  useCommonAccesibility()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.returnsRefunds}></SeoConfig>
      <Row>
        <PageTitle title={t('returns_refunds_page_title')} />
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
                          placeholder={t(
                            'products_filter_organization_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={handleChangeOrganizations}
                          ref={selectOrganizationRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedOrganizations}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='site-name'>
                          {t('products_filter_site_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectSiteOptions}
                          placeholder={t('products_filter_site_placeHolder')}
                          isMulti
                          isSearchable
                          onChange={handleChangeSites}
                          ref={selectSiteRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedSites}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='locale-name'>
                          {t('products_filter_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectLocaleOptions}
                          placeholder={t('products_filter_locale_placeHolder')}
                          isMulti
                          isSearchable
                          onChange={handleChangeLocales}
                          ref={selectLocaleRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedLocales}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='marketplace-name'>
                          {t('order_filter_marketplace_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='marketplace-name'
                          options={selectMarketplaceOptions}
                          placeholder={t(
                            'order_filter_marketplace_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={handleChangeMarketplaces}
                          ref={selectMarketplaceRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaces}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='return-status'>
                          {t('returns_refunds_return_order_status_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='return-status'
                          options={selectReturnStatusOptions}
                          placeholder={t(
                            'returns_refunds_return_order_status_place_holder'
                          )}
                          isMulti
                          isSearchable
                          onChange={handleChangeReturnStatuses}
                          ref={selectReturnStatusRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedReturnStatuses}
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
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={returnsRefunds}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={t('returns_refunds_table_empty_message')}
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={onPage}
          resizableColumns
          columnResizeMode='fit'
        >
          <Column
            header={t('returns_refunds_table_header_column_order_erp_id')}
            sortField='order.erpId'
            sortable
            body={(data: IReturnRefund) => (
              <Link to='#'>
                <FieldTextDataTable
                  value={data.order.erpId}
                  placement='bottom'
                />
              </Link>
            )}
          ></Column>
          <Column
            header={t(
              'returns_refunds_table_header_column_return_order_erp_id'
            )}
            sortField='erpId'
            sortable
            body={(data: IReturnRefund) => (
              <FieldTextDataTable value={data.erpId} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('returns_refunds_table_header_column_marketplace')}
            sortField='order.localeMarketplace.marketplace.name'
            sortable
            body={(data: IReturnRefund) => (
              <FieldTextDataTable
                value={data.marketplaceName}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('returns_refunds_table_header_column_requested_date')}
            sortField='returnRequestTime'
            sortable
            body={(data: IReturnRefund) => (
              <FieldTextDataTable
                value={data.requestedDate}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('returns_refunds_table_header_column_modified_date')}
            sortField='modifiedAt'
            sortable
            body={(data: IReturnRefund) => (
              <FieldTextDataTable
                value={data.modifiedDate}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('returns_refunds_table_header_column_status')}
            sortField='returnStatus'
            sortable
            body={(data: IReturnRefund) => (
              <FieldTextDataTable
                value={data.returnStatus}
                placement='bottom'
              />
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default ReturnsRefunds