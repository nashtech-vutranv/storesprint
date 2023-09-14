import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {useContext, useEffect, useRef, useState} from 'react'
import {Row, Col, Card, Accordion, Container, Button} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import {Button as ButtonPrime} from 'primereact/button'
import _ from 'lodash'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import CustomToggle from '../../components/CustomToggle'
import {TemplatePaginator} from '../../components/Paginator'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  transformToSelectData,
  decodeParam,
  getURLParamsObj,
  getMapIdsResponse,
} from '../../helpers'
import {
  usePagination,
  useCommonAccesibility,
  useHandleError, 
  useSelectUrlParams, 
  useCountLoading,
  usePreviousPage
} from '../../hooks'
import {IRelationshipLocation, IUrlParams, IMarketplaceRelationship, ISelectOption} from '../../interface'
import OrganizationService from '../../services/OrganizationService'
import SiteLocaleService from '../../services/SiteLocaleService'
import SiteServices from '../../services/SitesService'
import {GlobalContext} from '../../store/GlobalContext'
import {
  RowTableActionType,
  MarketplacerRelationshipActionType,
  PagesInfoActionType,
} from '../../store/actions'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import MarketplaceRelationshipService from '../../services/MarketplaceRelationshipService'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {
  ROUTE_MARKETPLACE_RELATIONSHIP,
  ROUTE_PARAMS,
  defaultAllDatasByErpIdPagination,
  defaultRelationshipTablePaginationPerPage,
  PERMISSIONS,
} from '../../constants'
import PageTitle from '../../components/PageTitle/PageTitle'
import {AddButton} from '../../components/Common'
import Searching from '../../components/Searching'

export default function Relationships() {
  const {t} = useTranslation()

  const navigate = useNavigate()
  const location = useLocation() as IRelationshipLocation

  const {
    state: {
      pagesInfo: {
        marketplaceRelationship: {searchData},
      },
      accordion,
    },
    dispatch: {
      rowTable: rowTableDispatch,
      marketplaceRelationship: marketplaceRelationshipDispatch,
      pagesInfo: pagesInfoDispatch,
    },
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
  } = usePagination(defaultRelationshipTablePaginationPerPage, true)

  const [marketplaceRelationships, setMarketplaceRelationships] = useState<
    IMarketplaceRelationship[]
  >([])
  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()
  const selectLocaleRef = useRef<any>()

  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedOrganizations, setSelectedOrganizations] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')
  )
  const [selectedSites, setSelectedSites] = useState<any>(
    useSelectUrlParams(['siteLs', 'siteVs'], 'site')
  )
  const [selectedLocales, setSelectedLocales] = useState<any>(
    useSelectUrlParams(['localeLs', 'localeVs'], 'locale')
  )

  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<any>([])
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)

  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )

  const [countLoadingPage, setCountLoadingPage] = useState<number>(0)

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_MARKETPLACE_RELATIONSHIP_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations: [],
        selectedSites: [],
        selectedLocales: [],
      },
    })
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    selectSiteRef.current.clearValue()
    selectLocaleRef.current.clearValue()
    setCountLoadingPage(0)
    setKeyword('')
    setCurrentStatus(null)
    setSelectedOrganizations([])
    setSelectedSites([])
    setSelectedLocales([])
    const clearedURLParamsObj = _.omit(selectedURLParamsObj, [
      'search',
      'currentStatus',
      'orgVs',
      'orgLs',
      'siteLs',
      'siteVs',
      'localeLs',
      'localeVs',
    ])
    setSelectedURLParamsObj({...clearedURLParamsObj})
    setSearchParams(clearedURLParamsObj as any)
    clearSearchData()
  }

  const onGetFiltersMarketplaceRelationshipsData = async () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_MARKETPLACE_RELATIONSHIP_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations,
        selectedSites,
        selectedLocales,
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

  const onGetRelationshipsData = (response: any) =>
    response.data.content.map((relationshipItem: any) => {
      return {
        ...relationshipItem,
        status: capitalizeFirstLetter(relationshipItem.status),
      }
    })

  const bindingRelationships = (response: any) => {
    const relationships = onGetRelationshipsData(response)
    setMarketplaceRelationships(relationships)
    setTotalRecords(response.data.totalElements)
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

  const onSearchCase = () => {
    setCountLoadingPage(countLoadingPage + 1)
    setCurrentStatus('search')
    setSelectedURLParamsObj({
      ...selectedURLParamsObj,
      currentStatus: 'search',
    })
    setSearchCount(searchCount + 1)
    onSearch()
  }

  const handleChangePage = (e: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    onPage(e)
  }

  const onPressKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearchCase()
    }
  }

  const directToRelationshipCreatePage = () => {
    navigate(ROUTE_MARKETPLACE_RELATIONSHIP.ADD, {
      state: {
        selectedOrganizations,
        selectedSites,
        selectedLocales,
        eventKey: accordion.product || '0',
        currentStatus,
      },
    })
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
      onClick={directToRelationshipCreatePage}
      label={t('marketplace_relationships_add_relationship')}
      permissions={[PERMISSIONS.add_marketplace_relationship]}
    />
  )

  const onSelectionChange = (e: any) => {
    marketplaceRelationshipDispatch({
      type: MarketplacerRelationshipActionType.GET_MARKETPLACE_RELATIONSHIPT_INFORMATION,
      payload: e.value,
    })
    navigate(
      ROUTE_MARKETPLACE_RELATIONSHIP.EDIT.replace(
        ROUTE_PARAMS.MARKETPLACE_RELATIONSHIP_ID,
        e.value.id
      ),
      {
        state: {
          selectedOrganizations,
          selectedSites,
          selectedLocales,
          eventKey: accordion.relationship || '0',
          currentStatus,
        },
      }
    )
  }

  const handleUpdateSelectedOrgsUrlParams = (selectedValue: any) => {
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

  const handleUpdateSelectedSitesUrlParams = (selectedValue: any) => {
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

  const handleUpdateSelectedLocalesUrlParams = (selectedValue: any) => {
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

  const handleChangeOrganizations = (selectedValue: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    setSelectedOrganizations(selectedValue)
  }

  const handleChangeSites = (selectedValue: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    setSelectedSites(selectedValue)
  }

  const handleChangeLocales = (selectedValue: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    setSelectedLocales(selectedValue)
  }

  const handleGetAllRelationships = () => {
    new MarketplaceRelationshipService(axiosClient)
      .getRelationshipsByFilter({...pagination}, {})
      .then((response: any) => {
        bindingRelationships(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetRelationshipsUsedSelectedValues = () => {
    new MarketplaceRelationshipService(axiosClient)
      .getRelationshipsByFilter(
        {
          ...pagination,
        },
        {
          organizationIds: selectedOrganizations.map((org: any) => org.value),
          siteIds: selectedSites.map((site: any) => site.value),
          siteLocaleIds: selectedLocales.map((locale: any) => locale.value),
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingRelationships(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetRelationshipsUsedSearchData = () => {
    new MarketplaceRelationshipService(axiosClient)
      .getRelationshipsByFilter(
        {
          ...pagination,
        },
        {
          organizationIds: searchData.selectedOrganizations
            ? searchData.selectedOrganizations.map((org: any) => org.value)
            : [],
          siteIds: searchData.selectedSites
            ? searchData.selectedSites.map((site: any) => site.value)
            : [],
          siteLocaleIds: searchData.selectedLocales
            ? searchData.selectedLocales.map((locale: any) => locale.value)
            : [],
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingRelationships(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
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
    if (!currentStatus && pagination && countLoadingPage === 0) {
      if (!location.state) {
        handleGetAllRelationships()
      } else {
        handleGetRelationshipsUsedSearchData()
      }
    }
  }, [pagination, currentStatus, countLoadingPage])

  useEffect(() => {
    if (currentStatus === 'apply' && pagination) {
      if (!location.state) {
        handleGetRelationshipsUsedSelectedValues()
      } else {
        handleGetRelationshipsUsedSearchData()
      }
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (currentStatus === 'search' && pagination) {
      countLoadingPage > 0 && handleGetRelationshipsUsedSearchData()
      countLoadingPage === 0 && handleGetRelationshipsUsedSelectedValues()
    }
  }, [pagination, searchCount, currentStatus])

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({...defaultAllDatasByErpIdPagination, rows: 1000})
      .then((response: any) => {
        const organizationsSelectData = transformToSelectData(
          response.data.content
        )
        setSelectOrganizationOptions(organizationsSelectData)
        if (response.data.content.length === 1) {
          setSelectedOrganizations([organizationsSelectData[0]])
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (countLoadingPage === 0 && selectOrganizationOptions.length > 1) return 
    handleUpdateSelectedOrgsUrlParams(selectedOrganizations)
    if (!_.isEmpty(selectedOrganizations)) {
      new SiteServices(axiosClient)
        .getSitesFromMultiOrganizations(
          {
            organizationIds: selectedOrganizations.map(
              (selectedOrg: any) => selectedOrg.value
            ),
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          setSelectSiteOptions(transformToSelectData(response.data.content))
          const mapSiteIdsResponse = getMapIdsResponse(response.data.content)
          setSelectedSites(
            selectedSites.filter((site: any) =>
              mapSiteIdsResponse.includes(site.value)
            )
          )
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
    if (countLoadingPage === 0) return
    handleUpdateSelectedSitesUrlParams(selectedSites)
    if (!_.isEmpty(selectedSites)) {
      new SiteLocaleService(axiosClient)
        .getLocalesFromMultiSites(
          {
            siteIds: selectedSites.map(
              (selectedSite: any) => selectedSite.value
            ),
          },
          defaultAllDatasByErpIdPagination
        )
        .then((response: any) => {
          setSelectLocaleOptions(transformToSelectData(response.data.content))
          const mapLocaleIdsResponse = getMapIdsResponse(response.data.content)
          setSelectedLocales(
            selectedLocales.filter((locale: any) =>
              mapLocaleIdsResponse.includes(locale.value)
            )
          )
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setSelectLocaleOptions([])
      setSelectedLocales([])
    }
  }, [selectedSites])

  useEffect(() => {
    handleUpdateSelectedLocalesUrlParams(selectedLocales)
  }, [selectedLocales])

  useCommonAccesibility()

  usePreviousPage('apps-marketplace-relationships', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.marketplaceRelationships}></SeoConfig>
      <Row>
        <PageTitle title={t('marketplace_relationships_title')} />
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
                    name='relationship'
                    selectedURLParamsObj={selectedURLParamsObj}
                    setSelectedURLParamsObj={setSelectedURLParamsObj}
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
                  />
                  <span style={{fontSize: '1.2rem', margin: 0}}>
                    {t('marketplace_relationships_fitler_title')}
                  </span>
                </div>
                <Accordion.Collapse eventKey='filter-accordion'>
                  <Container fluid className='px-0'>
                    <Row className='align-items-center pb-2'>
                      <Col xs={2}>
                        <label htmlFor='organization-name'>
                          {t('marketplace_relationships_organization_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectOrganizationOptions}
                          placeholder={t(
                            'marketplace_relationships_organization_placeHolder'
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
                          {t('marketplace_relationships_site_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectSiteOptions}
                          placeholder={t(
                            'marketplace_relationships_site_placeHolder'
                          )}
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
                          {t('marketplace_relationships_locale_label')}
                        </label>
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={selectLocaleOptions}
                          placeholder={t(
                            'marketplace_relationships_locale_placeHolder'
                          )}
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
                          onClick={onGetFiltersMarketplaceRelationshipsData}
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
          value={marketplaceRelationships}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(marketplaceRelationships)
              ? t('marketplace_relationships_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={handleChangePage}
          resizableColumns
          columnResizeMode='fit'
          onSelectionChange={onSelectionChange}
        >
          <Column
            header={t('marketplace_relationships_column_header_organization')}
            sortable
            sortField='organization.name'
            body={(data: IMarketplaceRelationship) => (
              <FieldTextDataTable
                value={data.organization.name}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('marketplace_relationships_column_header_site')}
            sortable
            sortField='siteLocale.site.name'
            body={(data: IMarketplaceRelationship) => (
              <FieldTextDataTable value={data.site.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('marketplace_relationships_column_header_locale')}
            sortable
            sortField='siteLocale.name'
            body={(data: IMarketplaceRelationship) => (
              <FieldTextDataTable
                value={data.siteLocale.name}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('marketplace_relationships_column_header_marketplace')}
            sortable
            sortField='marketplace.name'
            body={(data: IMarketplaceRelationship) => (
              <FieldTextDataTable
                value={data.marketplace ? data.marketplace.name : ''}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('marketplace_relationships_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
