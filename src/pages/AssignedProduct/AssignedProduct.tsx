import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {confirmDialog} from 'primereact/confirmdialog'
import {useContext, useEffect, useRef, useState} from 'react'
import {useSearchParams, useLocation} from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Accordion,
  Container,
  Button,
  Badge,
  OverlayTrigger,
  Popover,
  Form,
  Tooltip,
  Spinner,
} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import {Button as ButtonPrime} from 'primereact/button'
import _ from 'lodash'
import CustomToggle from '../../components/CustomToggle'
import {TemplatePaginator} from '../../components/Paginator'
import SeoConfig from '../../components/SEO/SEO-Component'
import DialogTemplate from '../../components/DialogTemplate'
import {seoProperty} from '../../constants/seo-url'
import {
  transformToSelectData,
  decodeParam,
  getURLParamsObj,
} from '../../helpers'
import {formatDateNoHours} from '../../utils/date'
import {
  usePagination,
  useCommonAccesibility,
  useOutsideClick,
  useHandleError,
  useSelectUrlParams,
  useCountLoading,
  useProcessLoading,
  usePreviousPage
} from '../../hooks'
import {IAssignedProducts, IUrlParams} from '../../interface'
import {GlobalContext} from '../../store/GlobalContext'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import AssignedProductService from '../../services/AssignedProductService'
import MarketplaceInventoryService from '../../services/MarketplaceMPService'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {assigningMarketplacesMessage} from '../../helpers/confirmMessage'
import {defaultAllDatasByErpIdPagination, PERMISSIONS} from '../../constants'
import IndeterminateCheckbox from '../../components/Indeterminate'
import AssignProductMessageDialog from '../../components/AssignProductMessageDialog'
import PageTitle from '../../components/PageTitle/PageTitle'
import Searching from '../../components/Searching'

export default function AssignedProduct() {
  const {t} = useTranslation()

  const location = useLocation() as any

  const {
    state: {
      pagesInfo: {
        assignedProduct: {isAllProductsSelected, selectedProducts, searchData},
      },
      permissionInformations: {checkHasPermissions},
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse, handleErrorPermissionWithToast} = useHandleError()

  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()
  const selectLocaleRef = useRef<any>()
  const selectMarketplaceRef = useRef<any>()
  const dialogMarketplacesRef = useRef<any>()
  const buttonDialogRef = useRef<any>()
  const popoverRef = useRef<any>()

  const [selectedOrganization, setSelectedOrganization] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')[0]
  )
  const [selectedSite, setSelectedSite] = useState<any>(
    useSelectUrlParams(['siteLs', 'siteVs'], 'site')[0]
  )
  const [selectedLocale, setSelectedLocale] = useState<any>(
    useSelectUrlParams(['localeLs', 'localeVs'], 'locale')[0]
  )
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<any>(
    useSelectUrlParams(['mrkLs', 'mrkVs'], 'mrk')
  )
  const [selectMarketplacesPropsValue, setSelectMarketplacesPropsValue] =
    useState<any>(null)
  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<any>([])
  const [selectMarketplaceOptions, setSelectMarketplaceOptions] = useState<any>(
    []
  )
  const [productsList, setProductsList] = useState<IAssignedProducts[]>([])
  const [
    isMessageSelectProductsDisplayed,
    setIsMessageSelectProductsDisplayed,
  ] = useState<boolean>(false)
  const [listMarketplacesInDialog, setListMarketplacesInDialog] =
    useState<any>(null)
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [resetCount, setResetCount] = useState<number>(1)
  const [marketplacesInSelectedProducts, setMarketplacesInSelectedProducts] =
    useState<any>(null)
  const [isAllDataFetched, setIsAllDataFetched] = useState<boolean>(true)

  const [searchParams, setSearchParams] = useSearchParams()

  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [countLoadingPage, setCountLoadingPage] = useState<number>(0)

  const {isProcessing, changeToCompleted, changeToFailed, changeToProcessing} =
    useProcessLoading()

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
  } = usePagination(undefined, true)

  const {isDialogDisplayed, setIsDialogDisplayed} = useOutsideClick(
    dialogMarketplacesRef,
    buttonDialogRef,
    popoverRef
  )

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization: null,
        selectedSite: null,
        selectedLocale: null,
        selectedMarketplaces: [],
      },
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
      payload: [],
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE,
      payload: false,
    })
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    selectSiteRef.current.clearValue()
    selectLocaleRef.current.clearValue()
    selectMarketplaceRef.current.clearValue()
    const clearedURLParamsObj = _.omit(selectedURLParamsObj, [
      'search',
      'currentStatus',
      'orgVs',
      'orgLs',
      'siteLs',
      'siteVs',
      'localeLs',
      'localeVs',
      'mrkVs',
      'mrkLs',
    ])
    setSelectedURLParamsObj({...clearedURLParamsObj})
    setSearchParams(clearedURLParamsObj as any)
    setCountLoadingPage(0)
    setSelectedOrganization(null)
    setKeyword('')
    setListMarketplacesInDialog(null)
    setIsDialogDisplayed(false)
    setIsAllDataFetched(true)
    setCurrentStatus(null)
    setResetCount(resetCount + 1)
    clearSearchData()
  }

  const onGetFiltersProductsMarketplacesData = () => {
    if (!selectedOrganization && !selectedSite && !selectedLocale) {
      return
    }
    if (isAllDataFetched) {
      setIsAllDataFetched(false)
    }
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization,
        selectedSite,
        selectedLocale,
        selectedMarketplaces,
      },
    })
    setCurrentStatus('apply')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    setKeyword('')
    setFilterCount(filterCount + 1)
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
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
      payload: [],
    })
  }

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const onSelectAllProductsByMessage = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE,
      payload: true,
    })
  }

  const onClearAllProductsByMessage = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE,
      payload: false,
    })
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
      payload: [],
    })
  }

  const onIndeterminateChange = (e: any) => {
    setListMarketplacesInDialog(
      listMarketplacesInDialog.map((item: any) =>
        item.id === e.target.id
          ? {
              ...item,
              assignedStatus: 'ASSIGNED',
              checked: true,
            }
          : item
      )
    )
  }

  const onApplyProductsToMarketplaces = () => {
    if (
      selectedOrganization &&
      selectedSite &&
      selectedLocale &&
      listMarketplacesInDialog
    ) {
      const requestBody = {
        organizationId: selectedOrganization.value,
        siteId: selectedSite.value,
        siteLocaleId: selectedLocale.value,
        isAllProducts: isAllProductsSelected,
        productIds: !_.isEmpty(selectedProducts)
          ? selectedProducts.map((slp: any) => slp.id)
          : [],
        assignedMarketplace: listMarketplacesInDialog,
      }
      changeToProcessing()
      new MarketplaceInventoryService(axiosClient)
        .assignSelectedProductsToMarketplaces(requestBody)
        .then(() => {
          pagination &&
            pagesInfoDispatch({
              type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
              payload: [],
            })
          currentStatus === 'apply' && setFilterCount(filterCount + 1)
          currentStatus === 'search' && setSearchCount(searchCount + 1)
          changeToCompleted()
        })
        .catch((err: any) => {
          handleErrorResponse(err)
          handleErrorPermissionWithToast(err)
          changeToFailed()
        })
    }
  }

  const onSelectionChange = (e: any) => {
    if (!compareArrayValues(e.value, productsList)) {
      pagination &&
        pagesInfoDispatch({
          type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
          payload: e.value,
        })
    }

    if (compareArrayValues(e.value, productsList)) {
      pagination &&
        pagesInfoDispatch({
          type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
          payload: _.uniqBy([...selectedProducts, ...e.value], 'id'),
        })
    }

    if (_.isEmpty(e.value)) {
      pagination &&
        pagesInfoDispatch({
          type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
          payload: selectedProducts.filter(
            (it: any) => !productsList.some((pd: any) => pd.id === it.id)
          ),
        })
    }

    if (isAllProductsSelected) {
      pagesInfoDispatch({
        type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE,
        payload: false,
      })
    }
  }

  const onMarketplacesSelectChange = (e: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    setSelectMarketplacesPropsValue(e)
    if (e.some((item: any) => item.value === 'un-assigned')) {
      if (e[e.length - 1].value === 'un-assigned') {
        setSelectedMarketplaces([
          {
            label: t(
              'assigned_products_marketplace_select_marketplace_dropdown_un_assigned'
            ),
            value: 'un-assigned',
          },
        ])
      } else {
        setSelectedMarketplaces(
          e.filter((item: any) => item.value !== 'un-assigned')
        )
      }
    }
    if (!e.find((item: any) => item.value === 'un-assigned')) {
      setSelectedMarketplaces(e)
    }
  }

  const onConFirmApllyProductsToMarketplacesMessage = () => {
    confirmDialog({
      message: (
        <AssignProductMessageDialog
          totalProducts={
            !isAllProductsSelected ? selectedProducts.length : totalRecords
          }
          assigningMarketplaces={assigningMarketplacesMessage(
            listMarketplacesInDialog,
            selectedProducts
          )}
          removingMarketplaces={listMarketplacesInDialog
            .filter((item: any) => item.assignedStatus === 'UNASSIGNED')
            .filter((it: any) =>
              marketplacesInSelectedProducts.some((md: any) => md.id === it.id)
            )
            .map((it: any) => it.name)}
        />
      ),
      header: <DialogTemplate />,
      rejectClassName: 'btn btn-danger',
      rejectLabel: t('common_confirm_cancel'),
      acceptClassName: 'btn btn-success mr-0',
      acceptLabel: t('common_confirm'),
      accept: () => onApplyProductsToMarketplaces(),
    })
  }

  const onCheckboxMarkplaceChange = (e: any) => {
    setListMarketplacesInDialog(
      listMarketplacesInDialog.map((item: any) =>
        item.name === e.target.name
          ? {
              ...item,
              assignedStatus:
                item.assignedStatus === 'ASSIGNED' ? 'UNASSIGNED' : 'ASSIGNED',
              checked: e.target.checked,
            }
          : item
      )
    )
  }

  const onSearchCase = () => {
    setCountLoadingPage(countLoadingPage + 1)
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount(searchCount + 1)
    !_.isEmpty(productsList) && onSearch()
  }

  const onCheckDataDisabled = () => {
    if (!isAllDataFetched) return true
    else return false
  }

  const handleChangePage = (e: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    onPage(e)
  }

  const onSampleProductsList = (response: any) => {
    return response.data.content.map((product: IAssignedProducts) => ({
      ...product,
      status: capitalizeFirstLetter(product.status),
      createdAt: formatDateNoHours(product.createdAt),
      modifiedAt: formatDateNoHours(product.modifiedAt),
      marketplaces: product.marketplaces ? product.marketplaces : [],
    }))
  }

  const onSetCheckListMarketplaceInDialog = (item: any) => {
    if (item.assignedStatus === 'ASSIGNED') return true
    if (item.assignedStatus === 'UNASSIGNED') return false
    return undefined
  }

  const compareArrayValues = (arr1: any, arr2: any) => {
    const sortarr1 = _.sortBy(arr1, 'id')
    const sortarr2 = _.sortBy(arr2, 'id')
    return _.isEqual(sortarr1, sortarr2)
  }

  const getSearchDataByField = (
    type: 'organizationId' | 'siteId' | 'siteLocaleId',
    _searchData: any,
    _isAllDataFetched: boolean
  ) => {
    switch (type) {
      case 'organizationId':
        return !_isAllDataFetched
          ? _searchData.selectedOrganization?.value
          : null
      case 'siteId':
        return !_isAllDataFetched ? _searchData.selectedSite?.value : null
      case 'siteLocaleId':
        return !_isAllDataFetched ? _searchData.selectedLocale?.value : null
      default:
    }
  }

  const handleChangeOrganization = (e: any) => {
    setResetCount(resetCount + 1)
    setCountLoadingPage(countLoadingPage + 1)
    setSelectedOrganization(e)
  }

  const handleChangeSite = (e: any) => {
    countLoadingPage !== 0 && setCountLoadingPage(countLoadingPage + 1)
    setSelectedSite(e)
  }

  const handleChangeLocale = (e: any) => {
    countLoadingPage !== 0 && setCountLoadingPage(countLoadingPage + 1)
    setSelectedLocale(e)
  }

  const templateLamda = TemplatePaginator('sample_lamda')

  const renderSelectedProductsMessage = () => {
    return isMessageSelectProductsDisplayed ? (
      <div className='d-flex justify-content-start align-items-center mt-2'>
        {!isAllProductsSelected && !_.isEmpty(selectedProducts) && (
          <>
            <span className='text-message'>
              {t('assigned_products_marketplace_message_all') +
                productsList.length +
                t('assigned_products_marketplace_message_select_per_page')}
            </span>
            <span
              onClick={onSelectAllProductsByMessage}
              className='text-select ml-ssm'
            >
              {t('assigned_products_marketplace_message_select_all') +
                totalRecords +
                t('assigned_products_marketplace_message_select_pages')}
            </span>
          </>
        )}
        {!(!isAllProductsSelected && !_.isEmpty(selectedProducts)) && (
          <>
            <span className='text-message'>
              {t('assigned_products_marketplace_message_all') +
                totalRecords +
                t('assigned_products_marketplace_message_select_all_pages')}
            </span>
            <span
              onClick={onClearAllProductsByMessage}
              className='text-select ml-ssm'
            >
              {t('assigned_products_marketplace_message_select_clear_pages')}
            </span>
          </>
        )}
      </div>
    ) : (
      <span></span>
    )
  }

  const renderDialogs = () => {
    return !_.isEmpty(listMarketplacesInDialog) ? (
      <div ref={dialogMarketplacesRef}>
        {listMarketplacesInDialog.map((item: any) =>
          item.assignedStatus === 'BOTH' ? (
            <div key={item.id} className='d-flex p-mb-md'>
              <IndeterminateCheckbox
                indeterminate={true}
                onChange={onIndeterminateChange}
                id={item.id}
              />
              <span>{item.name}</span>
            </div>
          ) : (
            <div key={item.id} className='w-100 p-mb-md'>
              <Form.Check
                inline
                label={item.name}
                name={item.name}
                type='checkbox'
                id={`inline-checkbox-${item.name}`}
                checked={item.checked}
                onChange={onCheckboxMarkplaceChange}
              />
            </div>
          )
        )}
        <div className='d-flex justify-content-center align-items-center'>
          <Button
            type='button'
            variant='success'
            onClick={onConFirmApllyProductsToMarketplacesMessage}
            disabled={
              _.isEmpty(selectedProducts) ||
              (!_.isEmpty(selectedProducts) &&
                selectedProducts.every((sp: any) =>
                  _.isEmpty(sp.marketplaces)
                ) &&
                listMarketplacesInDialog.every((item: any) => !item.checked))
            }
          >
            <span>{t('common_button_apply_label')}</span>
          </Button>
        </div>
      </div>
    ) : null
  }

  const renderHeader = () => {
    return (
      <>
        <Row>
          <div className='d-flex justify-content-start align-items-center'>
            <Col
              xs={8}
              sm={8}
              md={8}
              lg={8}
              xl={8}
              xxl={8}
              className='btn-mr-1'
            >
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
            {checkHasPermissions &&
              checkHasPermissions(
                [PERMISSIONS.list_de_list_products] || []
              ) && (
                <OverlayTrigger
                  show={
                    isDialogDisplayed && !_.isEmpty(listMarketplacesInDialog)
                  }
                  placement='bottom'
                  overlay={
                    <Popover popper id={'popover-positioned-bottom'}>
                      <Popover.Body ref={popoverRef}>
                        {renderDialogs()}
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button
                    type='button'
                    variant='success'
                    className='btn-ml-auto'
                    ref={buttonDialogRef}
                    disabled={
                      !selectedOrganization ||
                      !selectedSite ||
                      !selectedLocale ||
                      _.isEmpty(selectedProducts) ||
                      isProcessing
                    }
                    onClick={handleGetCalculateAssigneMarketplaces}
                  >
                    {isProcessing ? (
                      <Spinner
                        animation='border'
                        role='status'
                        as='span'
                        size='sm'
                        aria-hidden='true'
                        style={{
                          display: 'inline-block',
                          marginRight: '8px',
                        }}
                      >
                        <span className='visually-hidden'>Processing...</span>
                      </Spinner>
                    ) : (
                      <i
                        className='pi pi-plus'
                        style={{
                          display: 'inline-block',
                          marginRight: '8px',
                        }}
                      ></i>
                    )}
                    <span>
                      {t(
                        'assigned_products_marketplace_button_assign_marketplace_label'
                      )}
                    </span>
                  </Button>
                </OverlayTrigger>
              )}
          </div>
        </Row>
        <Row>{renderSelectedProductsMessage()}</Row>
      </>
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

  const handleGetCalculateAssigneMarketplaces = () => {
    if (selectedOrganization && selectedSite && selectedLocale) {
      const requestBody = {
        organizationId: selectedOrganization.value,
        siteId: selectedSite.value,
        siteLocaleId: selectedLocale.value,
        marketplaceIds: !_.isEmpty(selectedMarketplaces)
          ? selectedMarketplaces
              .filter((mrk: any) => mrk.value !== 'un-assigned')
              .map((it: any) => it.value)
          : [],
        isAllProducts: isAllProductsSelected,
        isUnassignedMarketplace: selectedMarketplaces.some(
          (slm: any) => slm.value === 'un-assigned'
        ),
        productIds: !_.isEmpty(selectedProducts)
          ? selectedProducts.map((slp: any) => slp.id)
          : [],
      }
      new MarketplaceInventoryService(axiosClient)
        .getCalculateAssigneMarketplaces(requestBody)
        .then((response: any) => {
          setIsDialogDisplayed(true)
          setListMarketplacesInDialog(
            response.data.map((item: any) => ({
              ...item,
              checked: onSetCheckListMarketplaceInDialog(item),
            }))
          )
        })
        .catch((err: any) => {
          setIsDialogDisplayed(false)
          handleErrorResponse(err)
          handleErrorPermissionWithToast(err)
        })
    }
  }

  const handleUpdateSelectedOrgsUrlParams = (selectedValue: any) => {
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

  const handleUpdateSelectedSitesUrlParams = (selectedValue: any) => {
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        siteLs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        siteVs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['siteLs', 'siteVs']),
      })
  }

  const handleUpdateSelectedLocalesUrlParams = (selectedValue: any) => {
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        localeLs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.label))
          .toString(),
        localeVs: [selectedValue]
          .map((slv) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['localeLs', 'localeVs']),
      })
  }

  const handleUpdateSelectedMarketplacesUrlParams = (selectedValue: any) => {
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        mrkLs: selectedValue
          .map((slv: any) => encodeURIComponent(slv.label))
          .toString(),
        mrkVs: selectedValue
          .map((slv: any) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['mrkLs', 'mrkVs']),
      })
  }

  useCountLoading(
    countLoadingPage,
    setSearchParams,
    selectedURLParamsObj,
    setSelectedURLParamsObj,
    pagination,
    clearSearchData,
    location,
    true
  )

  useEffect(() => {
    isAllDataFetched &&
      new AssignedProductService(axiosClient)
        .getOrganizationsWithReviewProductsBeforeListingProp({
          ..._.omit(defaultAllDatasByErpIdPagination, [
            'first',
            'keyword',
            'sortField',
            'sortOrder',
          ]),
          rows: 2000,
          isReviewProduct: true,
        })
        .then((response: any) => {
          const organizationsSelectData = transformToSelectData(
            response.data.content
          )
          setSelectOrganizationOptions(organizationsSelectData)
          if (response.data.content.length === 1 && resetCount === 1) {
            setSelectedOrganization(organizationsSelectData[0])
          }
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [resetCount])

  useEffect(() => {
    if (
      currentStatus === 'search' &&
      pagination &&
      (isAllDataFetched || (searchData && searchData.selectedOrganization))
    ) {
      new AssignedProductService(axiosClient)
        .getProductsByFilterInMarketplaceRelationship(pagination, {
          organizationId: getSearchDataByField(
            'organizationId',
            searchData,
            isAllDataFetched
          ),
          siteId: getSearchDataByField('siteId', searchData, isAllDataFetched),
          siteLocaleId: getSearchDataByField(
            'siteLocaleId',
            searchData,
            isAllDataFetched
          ),
          marketplaceIds:
            !isAllDataFetched &&
            searchData.selectedMarketplaces.some(
              (item: any) => item.value !== 'un-assigned'
            )
              ? searchData.selectedMarketplaces.map(
                  (marketplace: any) => marketplace.value
                )
              : [],
          search: keyword,
          isAllMarketplaces: false,
          isUnassignedMarketplaces:
            !isAllDataFetched &&
            searchData.selectedMarketplaces.some(
              (item: any) => item.value === 'un-assigned'
            )
              ? true
              : false,
        })
        .then((response: any) => {
          setProductsList(onSampleProductsList(response))
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, searchCount, currentStatus, isAllDataFetched])

  useEffect(() => {
    handleUpdateSelectedOrgsUrlParams(selectedOrganization)
    if (selectedOrganization) {
      pagesInfoDispatch({
        type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
        payload: [],
      })
      new AssignedProductService(axiosClient)
        .getSitesBySelectedReviewProductsBeforeListingOrganizations(
          {
            organizationIds: [selectedOrganization.value],
            isReviewProduct: true,
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          if (countLoadingPage !== 0) {
            setSelectedSite(null)
            selectSiteRef.current.clearValue()
            selectMarketplaceRef.current.clearValue()
          }
          setSelectSiteOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })

      resetCount === 1 &&
        pagination &&
        new AssignedProductService(axiosClient)
          .getProductsByFilterInMarketplaceRelationship(pagination, {
            organizationId: selectedOrganization.value,
            siteId: null,
            siteLocaleId: null,
            marketplaceIds: [],
            search: '',
            isAllMarketplaces: false,
            isUnassignedMarketplaces: false,
          })
          .then((response: any) => {
            setProductsList(onSampleProductsList(response))
            setTotalRecords(response.data.totalElements)
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
    } else {
      selectSiteRef.current.clearValue()
      setSelectSiteOptions([])
      setSelectMarketplaceOptions([])
      setProductsList([])
    }
  }, [selectedOrganization, resetCount])

  useEffect(() => {
    handleUpdateSelectedSitesUrlParams(selectedSite)
    if (selectedSite) {
      pagesInfoDispatch({
        type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
        payload: [],
      })
      new AssignedProductService(axiosClient)
        .getSiteLocalesBySelectedReviewProductsBeforeListingSites(
          {
            siteIds: [selectedSite.value],
            isReviewProduct: true,
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          if (countLoadingPage !== 0) {
            setSelectedLocale(null)
            selectLocaleRef.current.clearValue()
          }
          setSelectLocaleOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      selectLocaleRef.current.clearValue()
      setSelectLocaleOptions([])
    }
  }, [selectedSite])

  useEffect(() => {
    handleUpdateSelectedLocalesUrlParams(selectedLocale)
  }, [selectedLocale])

  useEffect(() => {
    if (selectedOrganization && selectedSite && selectedLocale) {
      pagination &&
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
              organizationIds: [selectedOrganization.value],
              siteLocaleIds: [selectedLocale.value],
              isReviewProduct: true,
            }
          )
          .then((response: any) => {
            const marketplacesAssignedList = response.data.content.map(
              (marketplace: any) => {
                return {
                  label: marketplace.name,
                  value: marketplace.id,
                }
              }
            )
            setSelectMarketplaceOptions([
              ...marketplacesAssignedList,
              {
                label: t(
                  'assigned_products_marketplace_select_marketplace_dropdown_un_assigned'
                ),
                value: 'un-assigned',
              },
            ])
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
    } else {
      setSelectedMarketplaces([])
      setSelectMarketplaceOptions([])
    }
  }, [selectedOrganization, selectedSite, selectedLocale])

  useEffect(() => {
    currentStatus === 'apply' &&
      pagination &&
      (selectedOrganization || selectedSite || selectedLocale) &&
      new AssignedProductService(axiosClient)
        .getProductsByFilterInMarketplaceRelationship(pagination, {
          organizationId: selectedOrganization
            ? selectedOrganization.value
            : null,
          siteId: selectedSite ? selectedSite.value : null,
          siteLocaleId: selectedLocale ? selectedLocale.value : null,
          marketplaceIds: selectedMarketplaces.some(
            (item: any) => item.value !== 'un-assigned'
          )
            ? selectedMarketplaces.map((marketplace: any) => marketplace.value)
            : [],
          search: keyword,
          isAllMarketplaces: false,
          isUnassignedMarketplaces: selectedMarketplaces.some(
            (item: any) => item.value === 'un-assigned'
          )
            ? true
            : false,
        })
        .then((response: any) => {
          setProductsList(onSampleProductsList(response))
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [filterCount, pagination, currentStatus])

  useEffect(() => {
    handleUpdateSelectedMarketplacesUrlParams(selectedMarketplaces)
    if (_.isEqual(selectedMarketplaces, selectMarketplacesPropsValue)) {
      return
    }
    if (selectedMarketplaces && selectMarketplacesPropsValue) {
      const filterRemoveList = selectMarketplacesPropsValue.filter(
        (item: any) =>
          selectedMarketplaces.some((sl: any) => sl.value !== item.value)
      )
      !_.isEmpty(filterRemoveList) &&
        filterRemoveList.forEach((item: any) => {
          selectMarketplaceRef.current.removeValue(item)
        })
    }
  }, [selectedMarketplaces])

  useEffect(() => {
    if (
      !_.isEmpty(productsList) &&
      productsList.every((pdi: any) =>
        selectedProducts.some((sli: any) => sli.id === pdi.id)
      )
    ) {
      setIsMessageSelectProductsDisplayed(true)
    } else {
      setIsMessageSelectProductsDisplayed(false)
    }
  }, [productsList, selectedProducts, pagination])

  useEffect(() => {
    if (isAllProductsSelected) {
      pagination &&
        pagesInfoDispatch({
          type: PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS,
          payload: _.uniqBy([...selectedProducts, ...productsList], 'id'),
        })
    }
  }, [isAllProductsSelected, productsList, pagination])

  useEffect(() => {
    document.querySelectorAll('.p-column-title').forEach((el, idx) => {
      if (idx === 0) {
        el.classList.add('p-inverse-header')
      }
    })
  }, [])

  useEffect(() => {
    document.querySelectorAll('.p-checkbox-icon').forEach((el, idx) => {
      if (idx === 0) {
        el.classList.remove('pi-check')
      }
    })
  }, [resetCount])

  useEffect(() => {
    document.querySelectorAll('input[type=checkbox]').forEach((el) => {
      el.setAttribute('aria-label', 'input-checkbox')
    })
  }, [document.querySelectorAll('input[type=checkbox]')])

  useEffect(() => {
    if (!selectedProducts) {
      setMarketplacesInSelectedProducts(null)
      return
    }
    let marketplacesProductSelected: any = []
    selectedProducts.forEach((item: any) => {
      if (item.marketplaces) {
        marketplacesProductSelected = [
          ...marketplacesProductSelected,
          ...item.marketplaces,
        ]
      }
    })
    setMarketplacesInSelectedProducts(
      _.uniqBy(marketplacesProductSelected, 'id')
    )
  }, [selectedProducts])

  useOutsideClick(dialogMarketplacesRef, buttonDialogRef)

  useCommonAccesibility()

  usePreviousPage('apps-assigned-products', {})

  useEffect(() => {
    document.querySelectorAll('[aria-checked]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
    })
  }, [document.querySelectorAll('[aria-checked]')])

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.assignProductToMarketplace}
      ></SeoConfig>
      <Row>
        <PageTitle title={t('assigned_products_marketplace_title')} />
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
                    name='assignedProduct'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('assigned_products_marketplace_fitler_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organization-name'>
                          {t(
                            'assigned_products_marketplace_organization_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectOrganizationOptions}
                          placeholder={t(
                            'assigned_products_marketplace_organization_placeHolder'
                          )}
                          isSearchable
                          onChange={handleChangeOrganization}
                          ref={selectOrganizationRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedOrganization}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='site-name'>
                          {t('assigned_products_marketplace_site_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectSiteOptions}
                          placeholder={t(
                            'assigned_products_marketplace_site_placeHolder'
                          )}
                          isSearchable
                          onChange={handleChangeSite}
                          ref={selectSiteRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedSite}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='locale-name'>
                          {t('assigned_products_marketplace_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectLocaleOptions}
                          placeholder={t(
                            'assigned_products_marketplace_locale_placeHolder'
                          )}
                          isSearchable
                          onChange={handleChangeLocale}
                          ref={selectLocaleRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedLocale}
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='marketplace-name'>
                          {t('assigned_products_marketplace_marketplace_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectMarketplaceOptions}
                          placeholder={t(
                            'assigned_products_marketplace_marketplace_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={onMarketplacesSelectChange}
                          ref={selectMarketplaceRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedMarketplaces}
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
                          onClick={onGetFiltersProductsMarketplacesData}
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
          value={productsList}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          selection={selectedProducts}
          header={renderHeader}
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(selectedOrganization) &&
            _.isEmpty(selectedSite) &&
            _.isEmpty(selectedLocale)
              ? t('assigned_products_marketplace_table_starting_message')
              : t('assigned_products_marketplace_table_empty_message')
          }
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={handleChangePage}
          resizableColumns
          columnResizeMode='fit'
          onSelectionChange={onSelectionChange}
          isDataSelectable={onCheckDataDisabled}
          className={`data-table-mh ${
            isAllDataFetched ? 'p-disabled-check' : ''
          }`}
        >
          <Column
            selectionMode='multiple'
            exportable={false}
            header={t('assigned_products_marketplace_column_header_all')}
          ></Column>
          <Column
            header={t('assigned_products_marketplace_column_header_erpId')}
            sortable
            sortField='erpId'
            body={(data: IAssignedProducts) => (
              <FieldTextDataTable value={data.erpId} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('assigned_products_marketplace_column_header_name')}
            sortable
            sortField='name'
            body={(data: IAssignedProducts) => (
              <FieldTextDataTable value={data.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t(
              'assigned_products_marketplace_column_header_marketplace'
            )}
            body={(data: IAssignedProducts) => (
              <div className='d-flex justify-content-start align-items-center'>
                {data.marketplaces &&
                  data.marketplaces.map((item) => {
                    if (!item.isMarketplaceSynced) {
                      return (
                        <Badge
                          key={`marketplace-id-${item.id}`}
                          pill
                          className='me-1 bg-info badge rounded-pill bg-primary'
                        >
                          <span>{item.name}</span>
                        </Badge>
                      )
                    } else
                      return (
                        <div>
                          <OverlayTrigger
                            key={item.id}
                            placement='bottom'
                            overlay={
                              <Tooltip
                                id='tooltip-bottom'
                                className='position-absolute'
                              >
                                {t('assigned_products_label_warning_message')}
                              </Tooltip>
                            }
                          >
                            <Badge
                              key={`marketplace-id-${item.id}`}
                              pill
                              className='me-1 bg-info badge rounded-pill bg-primary'
                            >
                              <span>{item.name}</span>
                              <i className='dripicons-warning pl-5'></i>
                            </Badge>
                          </OverlayTrigger>
                        </div>
                      )
                  })}
              </div>
            )}
          ></Column>
          <Column
            header={t(
              'assigned_products_marketplace_column_header_created_date'
            )}
            sortable
            sortField='createdAt'
            body={(data: IAssignedProducts) => (
              <FieldTextDataTable
                value={data.createdAt}
                placement='bottom'
                align='left'
              />
            )}
          ></Column>
          <Column
            header={t('assigned_products_marketplace_column_header_status')}
            sortField='status'
            sortable
            field='status'
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
