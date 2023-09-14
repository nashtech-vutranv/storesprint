import {useContext, useEffect, useRef, useState} from 'react'
import {useSearchParams, useLocation, Link} from 'react-router-dom'
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap'
import Select from 'react-select'
import {Column} from 'primereact/column'
import {confirmDialog} from 'primereact/confirmdialog'
import {DataTable} from 'primereact/datatable'
import {Button as ButtonPrime} from 'primereact/button'
import {Trans, useTranslation} from 'react-i18next'
import _ from 'lodash'
import CustomToggle from '../../components/CustomToggle'
import SeoConfig from '../../components/SEO/SEO-Component'
import {
  seoProperty,
  PERMISSIONS,
  ROUTE_PRODUCT,
  ROUTE_PARAMS,
} from '../../constants'
import {GlobalContext} from '../../store/GlobalContext'
import {
  useCommonAccesibility,
  usePagination,
  useHandleError,
  useSelectUrlParams,
  useCountLoading,
  usePreviousPage,
  useProcessLoading,
} from '../../hooks'
import {TemplatePaginator} from '../../components/Paginator'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import OrganizationServices from '../../services/OrganizationService'
import {
  transformToSelectData,
  decodeParam,
  getURLParamsObj,
  normallizeExceptFirstLetter,
} from '../../helpers'
import {
  defaultAllDatasByErpIdPagination,
  defaultListingStateTablePaginationPerPage,
} from '../../constants/pagination'
import SiteServices from '../../services/SitesService'
import SiteLocaleService from '../../services/SiteLocaleService'
import ListingStateService from '../../services/ListingStateManagementService'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {IListingState, IUrlParams} from '../../interface'
import {formatDate} from '../../utils'
import DialogTemplate from '../../components/DialogTemplate'
import MarketplaceService from '../../services/MarketplaceService'
import PageTitle from '../../components/PageTitle/PageTitle'
import {AddButton} from '../../components/Common'
import Searching from '../../components/Searching'
import {ToastContext} from '../../providers'

const DISABLE_STATUS = ['Accepted', 'Discoverable', 'Pending']

export default function ListingStatus() {
  const {t} = useTranslation()

  const location = useLocation() as any

  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()
  const selectLocaleRef = useRef<any>()
  const selectMarketplaceRef = useRef<any>()
  const selectListingStatusesRef = useRef<any>()

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
  const [selectedListingStatuses, setSelectedListingStatuses] = useState<any>(
    useSelectUrlParams(['lsLs', 'lsVs'], 'listingStatus')
  )
  const [listing, setListing] = useState<IListingState[]>([])
  const [selectedStates, setSelectedStates] = useState<IListingState[]>([])

  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<any>([])
  const [selectMarketplaceOptions, setSelectMarketplaceOptions] = useState<any>(
    []
  )
  const [selectListingStatusesOptions, setSelectListingStatusesOptions] =
    useState<any>([])
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [isAllDataFetched, setIsAllDataFetched] = useState<boolean>(true)
  const [resetCount, setResetCount] = useState<number>(1)
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
      pagesInfo: {
        listingStatus: {searchData},
      },
    },
    dispatch: {rowTable: rowTableDispatch, pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse, handleErrorPermissionWithToast} = useHandleError()

  const {isProcessing, changeToCompleted, changeToFailed, changeToProcessing} =
    useProcessLoading()

  const {toast} = useContext(ToastContext)

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
  } = usePagination(defaultListingStateTablePaginationPerPage, true)

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_LISTING_STATUS_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization: null,
        selectedSite: null,
        selectedLocale: null,
        selectedMarketplaces: [],
        selectedStatuses: [],
      },
    })
  }

  const onUpdateListing = (response: any) => {
    return response.data.content.map((item: any) => ({
      ...item,
      status: normallizeExceptFirstLetter(item.status),
    }))
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    selectSiteRef.current.clearValue()
    selectLocaleRef.current.clearValue()
    selectMarketplaceRef.current.clearValue()
    selectListingStatusesRef.current.clearValue()
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
      'lsVs',
      'lsLs',
    ])
    setSelectedURLParamsObj({...clearedURLParamsObj})
    setSearchParams(clearedURLParamsObj as any)
    setCountLoadingPage(0)
    setResetCount(resetCount + 1)
    setSelectSiteOptions(null)
    setSelectLocaleOptions(null)
    setSelectMarketplaceOptions([])
    setKeyword('')
    setSelectedStates([])
    setIsAllDataFetched(true)
    setCurrentStatus(null)
    clearSearchData()
  }

  const onFilter = () => {
    if (isAllDataFetched) {
      setIsAllDataFetched(false)
    }
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_LISTING_STATUS_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization,
        selectedSite,
        selectedLocale,
        selectedMarketplaces,
        selectedStatuses: selectedListingStatuses,
      },
    })
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'apply',
    })
    setCurrentStatus('apply')
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
    setSelectedStates([])
  }

  const onSelectionChange = (e: any) => {
    setSelectedStates(e.value)
  }

  const isRowSelectable = (e: any) => {
    return !DISABLE_STATUS.includes(e.data.status)
  }

  const rowClassName = (data: any) => {
    return !DISABLE_STATUS.includes(data.status) ? '' : 'p-disabled-check'
  }

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const onSearchCase = () => {
    setCurrentStatus('search')
    setSearchCount(searchCount + 1)
    !_.isEmpty(listing) && onSearch()
  }

  const displaySuccessMessage = () => {
    toast?.current?.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_relist'),
      life: 5000,
    })
  }

  const onReList = () => {
    if (selectedStates.length === 0) {
      return
    }
    confirmDialog({
      message: (
        <div style={{width: '100%', paddingRight: '1rem'}}>
          <span>{t('listing_status_are_you_sure')}</span>
          <br />
          <p>
            <Trans i18nKey={'listing_status_confirm_description'}></Trans>
          </p>
        </div>
      ),
      header: <DialogTemplate />,
      rejectClassName: 'btn btn-danger',
      acceptClassName: 'btn btn-success mr-0',
      acceptLabel: t('common_confirm'),
      rejectLabel: t('common_confirm_cancel'),
      position: 'top',
      closable: false,
      accept: () => {
        changeToProcessing()
        new ListingStateService(axiosClient)
          .reList({
            marketplaceProductIds: selectedStates.map(
              (x) => x.marketplaceProduct.id
            ),
          })
          .then(() => {
            let payload = {}
            if (currentStatus === 'apply') {
              payload = {
                organizationId: selectedOrganization?.value,
                siteId: selectedSite?.value,
                siteLocaleId: selectedLocale?.value,
                search: keyword.trim(),
                marketplaceIds: selectedMarketplaces.map((x: any) => x.value),
                statuses: selectedListingStatuses.map((s: any) => s.value),
              }
            }

            if (currentStatus === 'search') {
              payload = {
                organizationId: searchData.selectedOrganization?.value ?? null,
                siteId: searchData.selectedSite?.value ?? null,
                siteLocaleId: searchData.selectedLocale?.value ?? null,
                search: keyword.trim(),
                marketplaceIds:
                  searchData.selectedMarketplaces?.map((m: any) => m.value) ??
                  [],
                statuses:
                  searchData.selectedStatuses?.map((m: any) => m.value) ?? [],
              }
            }

            return new ListingStateService(axiosClient).getListingState(
              {
                ...pagination,
              },
              payload
            )
          })
          .then((response: any) => {
            setListing(onUpdateListing(response))
            setTotalRecords(response.data.totalElements)
            changeToCompleted()
            setSelectedStates([])
            displaySuccessMessage()
          })
          .catch((err: any) => {
            changeToFailed()
            handleErrorResponse(err)
            handleErrorPermissionWithToast(err)
          })
      },
    })
  }

  const templateLamda = TemplatePaginator('sample_lamda')

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
            <AddButton
              onClick={() => onReList()}
              permissions={[PERMISSIONS.re_list_products]}
              label={t('listing_status_re_list')}
              className='btn-ml-auto btn-h-95'
              disabled={isProcessing}
            >
              {isProcessing && (
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
              )}
              <span className='ml-2'>{t('listing_status_re_list')}</span>
            </AddButton>
          </div>
        </Row>
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

  const handleChangeMarketplaces = (e: any) => {
    countLoadingPage !== 0 && setCountLoadingPage(countLoadingPage + 1)
    setSelectedMarketplaces(e)
  }

  const handleChangeListingStatus = (e: any) => {
    countLoadingPage !== 0 && setCountLoadingPage(countLoadingPage + 1)
    setSelectedListingStatuses(e)
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

  const handleUpdateSelectedListingStatusUrlParams = (selectedValue: any) => {
    if (countLoadingPage === 0) return
    !_.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        lsLs: selectedValue
          .map((slv: any) => encodeURIComponent(slv.label))
          .toString(),
        lsVs: selectedValue
          .map((slv: any) => encodeURIComponent(slv.value))
          .toString(),
      })
    _.isEmpty(selectedValue) &&
      setSelectedURLParamsObj({
        ..._.omit(selectedURLParamsObj, ['lsLs', 'lsVs']),
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
    new OrganizationServices(axiosClient)
      .getAllOrganizations({
        ..._.omit(defaultAllDatasByErpIdPagination, [
          'first',
          'keyword',
          'sortField',
          'sortOrder',
        ]),
        rows: 2000,
        isReviewProduct: false,
      })
      .then((response: any) => {
        const organizationsSelectData = transformToSelectData(
          response.data.content
        )
        setSelectOrganizationOptions(organizationsSelectData)
        if (response.data.content.length === 1) {
          setSelectedOrganization(organizationsSelectData[0])
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })

    new ListingStateService(axiosClient)
      .getStatuses()
      .then((response: any) => {
        setSelectListingStatusesOptions(
          response.data.map((x: any) => ({
            label: x.name,
            value: x.type,
          }))
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    document.querySelectorAll('.p-column-title').forEach((el, idx) => {
      if (idx === 0) {
        el.classList.add('p-inverse-header')
      }
    })
  }, [])

  useEffect(() => {
    handleUpdateSelectedOrgsUrlParams(selectedOrganization)
    if (selectedOrganization) {
      new SiteServices(axiosClient)
        .getSitesFromMultiOrganizations(
          {
            organizationIds: [selectedOrganization.value],
            isReviewProduct: false,
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          setSelectedSite(null)
          selectSiteRef.current.clearValue()
          selectMarketplaceRef.current.clearValue()
          setSelectSiteOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      selectSiteRef.current.clearValue()
      setSelectSiteOptions([])
      setSelectMarketplaceOptions([])
    }
  }, [selectedOrganization])

  useEffect(() => {
    handleUpdateSelectedSitesUrlParams(selectedSite)
    if (selectedSite) {
      new SiteLocaleService(axiosClient)
        .getLocalesFromMultiSites(
          {
            siteIds: [selectedSite.value],
            isReviewProduct: false,
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          setSelectedLocale(null)
          selectLocaleRef.current.clearValue()
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
    handleUpdateSelectedMarketplacesUrlParams(selectedMarketplaces)
  }, [selectedMarketplaces])

  useEffect(() => {
    handleUpdateSelectedListingStatusUrlParams(selectedListingStatuses)
  }, [selectedListingStatuses])

  useEffect(() => {
    if (selectedOrganization && selectedSite && selectedLocale) {
      pagination &&
        new MarketplaceService(axiosClient)
          .getMarketplacesWithIsProductReviewProp(
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
              isReviewProduct: false,
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
            setSelectMarketplaceOptions(marketplacesAssignedList)
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
    setSelectedStates([])
  }, [
    selectedOrganization,
    selectedSite,
    selectedLocale,
    selectedMarketplaces,
    selectedListingStatuses,
  ])

  useEffect(() => {
    if (currentStatus === 'apply' && pagination) {
      new ListingStateService(axiosClient)
        .getListingState(
          {
            ...pagination,
          },
          {
            organizationId: selectedOrganization?.value,
            siteId: selectedSite?.value,
            siteLocaleId: selectedLocale?.value,
            search: keyword.trim(),
            marketplaceIds: selectedMarketplaces.map((x: any) => x.value),
            statuses: selectedListingStatuses.map((s: any) => s.value),
          }
        )
        .then((response: any) => {
          setListing(onUpdateListing(response))
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (isAllDataFetched && currentStatus === null && pagination) {
      if (!selectedOrganization) {
        new ListingStateService(axiosClient)
          .getListingState({...pagination}, {})
          .then((response: any) => {
            setListing(onUpdateListing(response))
            setTotalRecords(response.data.totalElements)
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
      } else {
        new ListingStateService(axiosClient)
          .getListingState(
            {...pagination},
            {
              organizationId: selectedOrganization.value,
              siteId: null,
              siteLocaleId: null,
              marketplaceIds: [],
              statuses: [],
              search: '',
            }
          )
          .then((response: any) => {
            setListing(onUpdateListing(response))
            setTotalRecords(response.data.totalElements)
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
      }
    }
  }, [pagination, isAllDataFetched, currentStatus, resetCount])

  useEffect(() => {
    if (
      currentStatus === 'search' &&
      pagination &&
      (isAllDataFetched ||
        (searchData &&
          searchData.selectedOrganization &&
          !_.isEmpty(searchData.selectedOrganization)))
    ) {
      new ListingStateService(axiosClient)
        .getListingState(
          {...pagination},
          {
            organizationId: !isAllDataFetched
              ? searchData.selectedOrganization?.value
              : null,
            siteId: !isAllDataFetched ? searchData.selectedSite?.value : null,
            siteLocaleId: !isAllDataFetched
              ? searchData.selectedLocale?.value
              : null,
            marketplaceIds: !isAllDataFetched
              ? searchData.selectedMarketplaces.map((m: any) => m.value)
              : [],
            statuses: !isAllDataFetched
              ? searchData.selectedStatuses.map((m: any) => m.value)
              : [],
            search: keyword.trim(),
          }
        )
        .then((response: any) => {
          setListing(onUpdateListing(response))
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, searchCount, currentStatus, isAllDataFetched])

  useEffect(() => {
    document.querySelectorAll('[aria-checked]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
    })
  }, [document.querySelectorAll('[aria-checked]')])

  useCommonAccesibility()

  usePreviousPage('apps-listing-status', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.listingStatus}></SeoConfig>
      <Row>
        <PageTitle title={t('listing_status_title')} />
        <Col xs={12}>
          <Card>
            <Card.Body style={{border: 'none'}}>
              <Accordion
                id='accordion'
                className='custom-accordion'
                defaultActiveKey={decodeParam('collapse', searchParams) || '0'}
              >
                <div className='d-flex align-items-center'>
                  <CustomToggle
                    eventKey='filter-accordion'
                    containerClass=''
                    style={{marginRight: '0.5rem'}}
                    linkClass=''
                    name='listingStatus'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('listing_status_filter_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organization-name'>
                          {t('listing_status_filter_title_organization_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          value={selectedOrganization}
                          options={selectOrganizationOptions}
                          placeholder={t(
                            'listing_status_filter_title_organization_placeHolder'
                          )}
                          isSearchable
                          onChange={handleChangeOrganization}
                          ref={selectOrganizationRef}
                          className='react-select'
                          classNamePrefix='react-select'
                        />
                      </Col>
                    </Row>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='site-name'>
                          {t('listing_status_filter_title_site_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectSiteOptions}
                          placeholder={t(
                            'listing_status_filter_title_site_placeHolder'
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
                          {t('listing_status_filter_title_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectLocaleOptions}
                          placeholder={t(
                            'listing_status_filter_title_locale_placeHolder'
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
                          {t('listing_status_filter_title_marketplace_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectMarketplaceOptions}
                          placeholder={t(
                            'listing_status_filter_title_marketplace_placeHolder'
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
                        <label htmlFor='status'>
                          {t(
                            'listing_status_filter_title_listing_status_label'
                          )}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectListingStatusesOptions}
                          placeholder={t(
                            'listing_status_filter_title_listing_status_placeHolder'
                          )}
                          isMulti
                          isSearchable
                          onChange={handleChangeListingStatus}
                          ref={selectListingStatusesRef}
                          className='react-select'
                          classNamePrefix='react-select'
                          value={selectedListingStatuses}
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
                        <Button variant='success' onClick={onFilter}>
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
      </Row>

      <DataTable
        sortField={pagination && pagination.sortField}
        sortOrder={pagination && pagination.sortOrder}
        totalRecords={totalRecords}
        dataKey='id'
        value={listing}
        paginator
        paginatorTemplate={templateLamda}
        first={pagination && pagination.first}
        rows={pagination && pagination.rows}
        responsiveLayout='scroll'
        selection={selectedStates}
        header={renderHeader}
        className='data-table-mh'
        paginatorClassName='table-paginator'
        emptyMessage={t('listing_status_table_no_data')}
        paginatorLeft={paginatorLeft}
        lazy
        onSort={onSort}
        onPage={onPage}
        resizableColumns
        columnResizeMode='fit'
        onSelectionChange={onSelectionChange}
        isDataSelectable={isRowSelectable}
        rowClassName={rowClassName}
        selectionPageOnly
      >
        <Column
          selectionMode='multiple'
          exportable={false}
          header={t('listing_status_table_column_all')}
        ></Column>
        <Column
          header={t('listing_status_table_column_erp_id')}
          sortable
          sortField='marketplaceProduct.product.erpId'
          field='product.erpId'
        ></Column>
        <Column
          header={t('listing_status_table_column_name')}
          sortable
          sortField='marketplaceProduct.product.name'
          body={(data: IListingState) => (
            <Link
              to={ROUTE_PRODUCT.DETAIL.replace(
                ROUTE_PARAMS.PRODUCT_ID,
                data.product.id || ''
              )}
            >
              {data.product.name}
            </Link>
          )}
        ></Column>
        <Column
          header={t('listing_status_table_column_marketplace')}
          sortable
          sortField='marketplaceProduct.localeMarketplace.marketplace.name'
          body={(data: IListingState) => (
            <FieldTextDataTable
              value={data.marketplace.name}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('listing_status_table_column_listed_date')}
          sortable
          sortField='listedDate'
          body={(data: IListingState) => (
            <FieldTextDataTable
              value={data.listedDate ? formatDate(data.listedDate) : ''}
              placement='bottom'
            />
          )}
        ></Column>
        <Column
          header={t('listing_status_table_column_status')}
          sortable
          sortField='status'
          body={(data: IListingState) => (
            <FieldTextDataTable value={data.status} placement='bottom' />
          )}
        ></Column>
        <Column
          header={t('listing_status_table_column_error_message')}
          sortable
          sortField='errorMessage'
          body={(data: IListingState) => (
            <FieldTextDataTable value={data.errorMessage} placement='bottom' />
          )}
        ></Column>
      </DataTable>
    </>
  )
}
