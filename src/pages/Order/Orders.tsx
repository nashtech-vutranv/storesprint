import {useState, useEffect, useContext, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {Container, Row, Col, Button, Card, Accordion} from 'react-bootstrap'
import {
  DataTable,
  DataTableDataSelectableParams,
  DataTableRowClickEventParams,
  DataTableSelectionChangeParams,
} from 'primereact/datatable'
import {Column} from 'primereact/column'
import Select from 'react-select'
import _ from 'lodash'
import {Button as ButtonPrime} from 'primereact/button'
import {confirmDialog} from 'primereact/confirmdialog'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import PageTitle from '../../components/PageTitle/PageTitle'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {GlobalContext} from '../../store/GlobalContext'
import {
  useCommonAccesibility,
  usePagination,
  useSelectUrlParams,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import {TemplatePaginator} from '../../components/Paginator'
import CustomToggle from '../../components/CustomToggle'
import {ROUTE_PARAMS, ROUTE_ORDER} from '../../constants'
import DialogTemplate from '../../components/DialogTemplate'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import OrganizationService from '../../services/OrganizationService'
import {
  transformToSelectData,
  getURLParamsObj,
  decodeParam,
} from '../../helpers'
import SiteServices from '../../services/SitesService'
import SiteLocaleService from '../../services/SiteLocaleService'
import {IOrder, IUrlParams, ISelectOption, IOrdersFilter} from '../../interface'
import OrderServices from '../../services/OrderService'
import {formatDate, getValuesFromOptions} from '../../utils'
import AssignedProductService from '../../services/AssignedProductService'
import {
  defaultAllDatasByErpIdPagination,
  defaultTablePaginationSortByErpIdPerPage,
} from '../../constants/pagination'
import {ToastContext} from '../../providers'
import Searching from '../../components/Searching'

const VALID_CHECKBOX_STATUSES = ['TRANSFERRED_FAILED', 'CONFIRMED_FAILED']

export default function Orders() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>([])
  const [isAllPageSelected, setIsAllPageSelected] = useState<boolean>(false)
  const [isUseAccessibilityOnTick, setIsUseAccessibilityOnTick] = useState<boolean>(false)

  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const [searchParams, setSearchParams] = useSearchParams()

  const {
    state: {
      accordion,
      pagesInfo: {
        order: {searchData},
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)
  const [selectedOrganizations, setSelectedOrganizations] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')
  )
  const [selectedSites, setSelectedSites] = useState<any>(
    useSelectUrlParams(['siteLs', 'siteVs'], 'site')
  )
  const [selectedLocales, setSelectedLocales] = useState<any>(
    useSelectUrlParams(['localeLs', 'localeVs'], 'locale')
  )
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<any>(
    useSelectUrlParams(['mrkLs', 'mrkVs'], 'mrk')
  )
  const [selectedStatuses, setSelectedStatuses] = useState<any>(
    useSelectUrlParams(['stLs', 'stVs'], 'st')
  )
  const [selectOrganizationOptions, setSelectOrganizationOptions] = useState<
    ISelectOption[]
  >([])
  const [selectSiteOptions, setSelectSiteOptions] = useState<ISelectOption[]>(
    []
  )
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<
    ISelectOption[]
  >([])
  const [selectMarketplaceOptions, setSelectMarketplaceOptions] = useState<
    ISelectOption[]
  >([])
  const [selectStatusOptions, setSelectStatusOptions] = useState<
    ISelectOption[]
  >([])
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )
  const [, setCountFailureOrders] = useState<number>(0)
  const [isHaveCheckbox, setIsHaveCheckbox] = useState<boolean>(false)

  const [isSitesSelectFirstLoading, setIsSitesSelectFirstLoading] =
    useState<boolean>(true)
  const [isLocalesSelectFirstLoading, setIsLocalesSelectFirstLoading] =
    useState<boolean>(true)
  const [
    isMarketplacesSelectFirstLoading,
    setIsMarketplacesSelectFirstLoading,
  ] = useState<boolean>(true)
  const [isRemindUserForSelectOrderQuantities, setIsRemindUserForSelectOrderQuantities] = useState<boolean>(false)

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const initialPaginationRef = useRef<any>({
    ...defaultTablePaginationSortByErpIdPerPage,
    sortField: 'modifiedAt',
    sortOrder: -1,
  })

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
  } = usePagination(
    initialPaginationRef.current,
    true
  )

  const onGetOrderData = (response: any) =>
    response.data.content.map((order: IOrder) => {
      return {
        ...order,
        marketplacePurchaseDate: order.marketplacePurchaseDate
          ? formatDate(order.marketplacePurchaseDate)
          : '',
        modifiedAt: formatDate(order.modifiedAt),
      }
    })

  const bindingOrders = (response: any) => {
    const ordersData = onGetOrderData(response)
    setOrders(ordersData)
    setTotalRecords(response.data.totalElements)
  }

  const handleCountFailedOrders = (requestBody: IOrdersFilter) => {
    new OrderServices(axiosClient)
      .countFailureOrder(requestBody)
      .then((response: any) => {
        setCountFailureOrders(response.data.numberOfOrders)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetOrdersUsedSearchData = () => {
    const requestBody = {
      organizationIds: searchData.selectedOrganizations
        ? getValuesFromOptions(searchData.selectedOrganizations)
        : [],
      siteIds: searchData.selectedSites
        ? getValuesFromOptions(searchData.selectedSites)
        : [],
      siteLocaleIds: searchData.selectedLocales
        ? getValuesFromOptions(searchData.selectedLocales)
        : [],
      statuses: searchData.selectedStatuses
        ? getValuesFromOptions(searchData.selectedStatuses)
        : [],
      marketplaceIds: searchData.selectedMarketplaces
        ? getValuesFromOptions(searchData.selectedMarketplaces)
        : [],
      search: keyword,
    }
    new OrderServices(axiosClient)
      .getOrders(
        {
          ...pagination,
        },
        requestBody
      )
      .then((response: any) => {
        bindingOrders(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getRequestFromSearchData = () => {
    return {
      organizationIds: searchData.selectedOrganizations
        ? getValuesFromOptions(searchData.selectedOrganizations)
        : [],
      siteIds: searchData.selectedSites
        ? getValuesFromOptions(searchData.selectedSites)
        : [],
      siteLocaleIds: searchData.selectedLocales
        ? getValuesFromOptions(searchData.selectedLocales)
        : [],
      search: keyword,
      statuses: searchData.selectedStatuses
        ? getValuesFromOptions(searchData.selectedStatuses)
        : [],
      marketplaceIds: searchData.selectedMarketplaces
        ? getValuesFromOptions(searchData.selectedMarketplaces)
        : [],
    }
  }

  useEffect(() => {
    if (pagination && !currentStatus) {
      new OrderServices(axiosClient)
        .getOrders({...pagination}, {})
        .then((response: any) => {
          bindingOrders(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [currentStatus, pagination])

  useEffect(() => {
    if (pagination && currentStatus === 'apply') {
      handleGetOrdersUsedSearchData()
      handleCountFailedOrders(getRequestFromSearchData())
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (pagination && currentStatus === 'search') {
      handleGetOrdersUsedSearchData()
    }
  }, [pagination, currentStatus, searchCount])

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({...defaultAllDatasByErpIdPagination})
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

    new OrderServices(axiosClient)
      .getStatuses()
      .then((response: any) => {
        const options = response.data.map((x: any) => ({
          label: x.name,
          value: x.type,
        }))
        setSelectStatusOptions(options)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (!_.isEmpty(selectedOrganizations)) {
      new SiteServices(axiosClient)
        .getSitesFromMultiOrganizations(
          {
            organizationIds: getValuesFromOptions(selectedOrganizations),
          },
          {
            ...defaultAllDatasByErpIdPagination,
          }
        )
        .then((response: any) => {
          setSelectSiteOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setSelectedSites([])
      setSelectSiteOptions([])
    }
  }, [selectedOrganizations])

  useEffect(() => {
    if (!_.isEmpty(selectedSites)) {
      new SiteLocaleService(axiosClient)
        .getLocalesFromMultiSites(
          {
            siteIds: getValuesFromOptions(selectedSites),
          },
          {
            ...defaultAllDatasByErpIdPagination,
          }
        )
        .then((response: any) => {
          setSelectLocaleOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setSelectedLocales([])
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
      setSelectedMarketplaces([])
      setSelectMarketplaceOptions([])
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
    if (orders.length !== 0) {
      document.querySelectorAll('.p-column-title').forEach((el, idx) => {
        if (idx === 0) {
          el.classList.add('p-inverse-header')
        }
      })
    }
  }, [searchData.selectedStatuses, orders])

  useEffect(() => {
    if (selectedStatuses.length) {
      const valueOfStatus = selectedStatuses.map((item: any) => item.value)
      if ((valueOfStatus.includes('TRANSFERRED_FAILED') 
      || valueOfStatus.includes('CONFIRMED_FAILED')) && currentStatus === 'apply') {
        document.querySelectorAll('div[role="checkbox"]').forEach((el) => {
          el.setAttribute('aria-label', 'checkbox')
        })
      }
    } 
  }, [selectedStatuses, filterCount, currentStatus])

  useEffect(() => {
    document.querySelectorAll('.p-checkbox-box').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
    })
  }, [document.querySelectorAll('.p-checkbox-box')])

  useEffect(() => {
    if (pagination && orders.length !== 0) {
      const filterredRecord = getFilterRecord(orders)
      if (isAllPageSelected) {
        const uniqOrders = _.uniqBy(
          [...selectedOrders, ...filterredRecord],
          (order) => order.id
        )
        setSelectedOrders(uniqOrders)
      }
    }
  }, [orders])

  useCommonAccesibility()

  usePreviousPage('apps-orders', {})

  useEffect(() => {
    currentStatus === 'apply' && document.querySelectorAll('div[role=checkbox]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
    })
  }, [currentStatus])

  const onClearCurrentFilters = () => {
    setCurrentStatus(null)
    setSelectedURLParamsObj({
      ..._.omit(selectedURLParamsObj, [
        'currentStatus',
        'search',
        'orgVs',
        'orgLs',
        'siteVs',
        'siteLs',
        'localeVs',
        'localeLs',
        'mrkVs',
        'mrkLs',
        'stVs',
        'stLs',
      ]),
    })
    setKeyword('')
    setSelectedOrganizations([])
    setSelectedSites([])
    setSelectedLocales([])
    setSelectedMarketplaces([])
    setSelectedStatuses([])
    setSelectedOrders([])
    setCountFailureOrders(0)
    setIsAllPageSelected(false)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ORDER_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations: [],
        selectedSites: [],
        selectedLocales: [],
        selectedMarketplaces: [],
        selectedStatuses: [],
      },
    })
  }

  const onGetFiltersOrdersData = async () => {
    setCurrentStatus('apply')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    setKeyword('')
    setFilterCount(filterCount + 1)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ORDER_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations,
        selectedSites,
        selectedLocales,
        selectedMarketplaces,
        selectedStatuses,
      },
    })
  }

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount(searchCount + 1)
    !_.isEmpty(orders) && onSearch()
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
          <Button
            type='button'
            variant='success'
            className='btn-ml-auto btn-h-95'
            disabled={selectedOrders.length === 0}
            onClick={onHandleResubmit}
          >
            {t('common_button_resubmit')}
          </Button>
        </div>
      </Row>
    )
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

  const getFilterRecord = (ordersData: IOrder[]) =>
    ordersData.filter((order: IOrder) =>
      VALID_CHECKBOX_STATUSES.some(
        (x: string) => x === getStatus(order.orderStatus)
      )
    )

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    setIsUseAccessibilityOnTick(true)
    e.originalEvent.stopPropagation()
    const filterredRecord = getFilterRecord(orders)
    setIsAllPageSelected(false)
    if (e.type === 'all' && e.value.length === 0) {
      const filterredSelectedOrder = removeUncheckedOrder(
        selectedOrders,
        filterredRecord
      )
      setSelectedOrders(filterredSelectedOrder)
    } else if (e.type === 'all' && e.value.length !== 0) {
      const uniqOrders = _.uniqBy(
        [...selectedOrders, ...e.value],
        (order) => order.id
      )
      setSelectedOrders(uniqOrders)
    } else if (e.type === 'checkbox') {
      setSelectedOrders(e.value)
    }
  }

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

  const handleChangeStatuses = (selectedValue: any) => {
    setSelectedStatuses(selectedValue)
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        stLs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        stVs: (selectedValue as Array<ISelectOption>)
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['stLs', 'stVs']),
      })
  }

  const handleRemindUserOnSelectedQuantities = () => {
    confirmDialog({
      message: t('order_confirm_selection_message'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => {
        setIsRemindUserForSelectOrderQuantities(false)
        return
      },
      onHide: () => {
        setIsRemindUserForSelectOrderQuantities(false)
        return
      }
    })
  }

  useEffect(() => {
    isUseAccessibilityOnTick &&
      document.querySelectorAll('div[role=checkbox]').forEach((el) => {
        el.setAttribute('aria-label', 'checkbox')
      })
  }, [isUseAccessibilityOnTick])

  useEffect(() => {
    const statusValues = selectedStatuses.map((x: ISelectOption) => x.value)
    const haveCheckbox =
      statusValues.length !== 0 &&
      selectedStatuses.some((x: ISelectOption) =>
        VALID_CHECKBOX_STATUSES.includes(x.value)
      )
    setIsHaveCheckbox(haveCheckbox)
  }, [searchData.selectedStatuses])

  useEffect(() => {
    isRemindUserForSelectOrderQuantities && handleRemindUserOnSelectedQuantities()
  }, [isRemindUserForSelectOrderQuantities])

  useEffect(() => {
    document.querySelectorAll('.p-toast-icon-close').forEach((el) => {
      el.setAttribute('aria-label', 'close-button')
    })
  }, [document.querySelectorAll('.p-toast-icon-close')])

  const onHandleResubmit = () => {
    if (selectedOrders.length > 100) {
      setIsRemindUserForSelectOrderQuantities(true)
    } else {
      new OrderServices(axiosClient)
        .reProcess({
          search: keyword,
          isAllOrder: isAllPageSelected,
          organizationIds: getValuesFromOptions(
            searchData.selectedOrganizations
          ),
          siteIds: getValuesFromOptions(searchData.selectedSites),
          siteLocaleIds: getValuesFromOptions(searchData.selectedLocales),
          marketplaceIds: getValuesFromOptions(searchData.selectedMarketplaces),
          statuses: getValuesFromOptions(searchData.selectedStatuses),
          orderIds: selectedOrders.map((x: IOrder) => x.id),
        })
        .then(() => {
          const isTransferFailed =
            selectedStatuses.findIndex(
              (x: ISelectOption) => x.value === VALID_CHECKBOX_STATUSES[0]
            ) !== -1
          toast?.current.show({
            severity: 'success',
            summary: t('toast_success_title'),
            detail: t(
              isTransferFailed
                ? 'toast_success_resubmit_transfer_failed'
                : 'toast_success_resubmit_confirm_failed',
              {
                selectedOrders: selectedOrders.length,
              }
            ),
            life: 5000,
          })
          setIsAllPageSelected(false)
          setSelectedOrders([])
          refreshInitialState()
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }

  const getStatus = (statusText: string) => {
    if (selectStatusOptions.length === 0) {
      return null
    }
    const status = selectStatusOptions.find(
      (option: ISelectOption) => option.label === statusText
    )
    if (!status) {
      return null
    }
    return status.value
  }

  const isRowSelectable = (e: DataTableDataSelectableParams) => {
    return VALID_CHECKBOX_STATUSES.some(
      (x: string) => x === getStatus(e.data.orderStatus)
    )
  }

  const rowClassName = (data: any) => {
    return VALID_CHECKBOX_STATUSES.some(
      (x: string) => x === getStatus(data.orderStatus)
    )
      ? ''
      : 'p-disabled-check'
  }

  const onRowClick = (e: DataTableRowClickEventParams) => {
    navigate(ROUTE_ORDER.DETAIL.replace(ROUTE_PARAMS.ORDER_ID, e.data.id), {
      state: {
        selectedOrganizations,
        selectedSites,
        selectedLocales,
        selectedMarketplaces,
        selectedStatuses,
        eventKey: accordion.order || '0',
        currentStatus,
        prevUrl: `${location.pathname}${location.search}`,
        viewlistLocation: location,
      },
    })
  }

  const removeUncheckedOrder = (
    _selectedOrders: IOrder[],
    uncheckedOrders: IOrder[]
  ) => {
    const filterredSelectedOrder = [..._selectedOrders]
    for (const order of uncheckedOrders) {
      const index = filterredSelectedOrder.findIndex((x) => x.id === order.id)
      if (index !== -1) {
        filterredSelectedOrder.splice(index, 1)
      }
    }
    return filterredSelectedOrder
  }

  return (
    <>
      <SeoConfig seoProperty={seoProperty.orders}></SeoConfig>
      <Row>
        <PageTitle title={t('orders_title')} />
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
                    name='order'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('order_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organization-name'>
                          {t('order_filter_organization_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='organization-name'
                          options={selectOrganizationOptions}
                          placeholder={t(
                            'order_filter_organization_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={handleChangeOrganizations}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedOrganizations}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='site-name'>
                          {t('order_filter_site_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='site-name'
                          options={selectSiteOptions}
                          placeholder={t('order_filter_site_placeHolder')}
                          isMulti
                          isSearchable
                          onChange={handleChangeSites}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedSites}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='locale-name'>
                          {t('order_filter_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='locale-name'
                          options={selectLocaleOptions}
                          placeholder={t('order_filter_locale_placeHolder')}
                          isMulti
                          isSearchable
                          onChange={handleChangeLocales}
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
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaces}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='order-status'>
                          {t('order_filter_status_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          id='order-status'
                          options={selectStatusOptions}
                          placeholder={t('order_filter_status_placeHolder')}
                          isMulti
                          isSearchable
                          onChange={handleChangeStatuses}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedStatuses}
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
                          onClick={onGetFiltersOrdersData}
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
          value={orders}
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
          emptyMessage={t('order_table_no_data')}
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={onPage}
          resizableColumns
          columnResizeMode='fit'
          isDataSelectable={isRowSelectable}
          onRowClick={onRowClick}
          rowClassName={rowClassName}
          selection={selectedOrders}
        >
          {isHaveCheckbox && (
            <Column
              selectionMode='multiple'
              exportable={false}
              header={t('listing_status_table_column_all')}
            ></Column>
          )}
          <Column
            header={t('order_column_header_erp_id')}
            sortField='erpId'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable value={data.erpId} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('order_column_header_marketplace')}
            sortField='localeMarketplace.marketplace.name'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable
                value={data.marketplace.name}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('order_column_header_marketplace_order_number')}
            sortField='marketplaceOrderNumber'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable
                value={data.marketplaceOrderNumber}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('order_column_header_created_date')}
            sortField='marketplacePurchaseDate'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable
                value={data.marketplacePurchaseDate}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('order_column_header_modified_date')}
            sortField='modifiedAt'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable value={data.modifiedAt} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('order_column_header_order_status')}
            sortField='orderStatus'
            sortable
            body={(data: IOrder) => (
              <FieldTextDataTable value={data.orderStatus} placement='bottom' />
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
