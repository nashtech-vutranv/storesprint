import {useState, useEffect, useRef, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import _ from 'lodash'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Container, Row, Col, Button, Card, Accordion} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import {Button as ButtonPrime} from 'primereact/button'
import Searching from '../../components/Searching'
import {ROUTE_PARAMS, ROUTE_PRODUCT} from '../../constants'
import OrganizationService from '../../services/OrganizationService'
import ProductServices from '../../services/ProductService'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {TemplatePaginator} from '../../components/Paginator'
import CustomToggle from '../../components/CustomToggle'
import {usePagination, useCommonAccesibility, useSelectUrlParams, useHandleError, useCountLoading, usePreviousPage} from '../../hooks'
import {
  IProducts,
  IProductLocation,
  IUrlParams,
  ISelectOption,
} from '../../interface'
import PageTitle from '../../components/PageTitle/PageTitle'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {
  transformToSelectData,
  capitalizeFirstLetter,
  decodeParam,
  getURLParamsObj,
} from '../../helpers'
import {PagesInfoActionType, RowTableActionType} from '../../store/actions'
import {GlobalContext} from '../../store/GlobalContext'
import {defaultTablePaginationSortByErpIdPerPage} from '../../constants/pagination'

const Products = () => {
  const [products, setProducts] = useState<IProducts[]>([])
  const {t} = useTranslation()
  const selectOrganizationRef = useRef<any>()
  const navigate = useNavigate()
  const location = useLocation() as IProductLocation

  const [searchParams, setSearchParams] = useSearchParams()

  const {
    state: {
      accordion,
      pagesInfo: {
        product: {searchData},
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
  } = usePagination(defaultTablePaginationSortByErpIdPerPage, true)

  const [selectedOrganizations, setSelectedOrganizations] = useState<any>(
    useSelectUrlParams(['orgLs', 'orgVs'], 'org')
  )

  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    decodeParam('currentStatus', searchParams)
  )
  
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )
  const [countLoadingPage, setCountLoadingPage] = useState<number>(0)

  const clearSearchData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations: [],
        selectedLocales: [],
        selectedSites: [],
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
      type: PagesInfoActionType.GET_PRODUCT_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganizations
      },
    })
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    setPagination(defaultPagination)
    setCountLoadingPage(0)
    setCurrentStatus(null)
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
    setKeyword('')
    setSelectedOrganizations([])
    clearSearchData()
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

  const bindingProducts = (response: any) => {
    setProducts(
      response.data.content.map((product: any) => {
        return {
          ...product,
          status: capitalizeFirstLetter(product.status),
        }
      })
    )
    setTotalRecords(response.data.totalElements)
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

  const handleSelectionChange = (e: DataTableSelectionChangeParams) => {
    navigate(
      ROUTE_PRODUCT.DETAIL.replace(ROUTE_PARAMS.PRODUCT_ID, e.value.id),
      {
        state: {
          selectedOrganizations,
          eventKey: accordion.product || '0',
          currentStatus,
          viewlistLocation: location,
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

  const handleChangeOrganizations = (selectedValue: any) => {
    setCountLoadingPage(countLoadingPage + 1)
    setSelectedOrganizations(selectedValue)
  }

  const handleGetAllProducts = () => {
    new ProductServices(axiosClient)
      .getProductsByFilter(
        {
          ...pagination,
        },
        {}
      )
      .then((response: any) => {
        bindingProducts(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetProductsUsedSearchData = () => {
    new ProductServices(axiosClient)
      .getProductsByFilter(
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
        bindingProducts(response)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGetProductsUsedSelectedValues = () => {
    new ProductServices(axiosClient)
      .getProductsByFilter(
        {
          ...pagination,
        },
        {
          organizationIds: selectedOrganizations
            ? selectedOrganizations.map((org: any) => org.value)
            : [],
          search: keyword,
        }
      )
      .then((response: any) => {
        bindingProducts(response)
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
    if (pagination && !currentStatus) {
      if (!location.state) {
        handleGetAllProducts()
      } else {
        handleGetProductsUsedSearchData()
      }
    }
  }, [currentStatus, pagination, countLoadingPage])

  useEffect(() => {
    if (pagination && currentStatus === 'apply') {
      if (!location.state) {
        handleGetProductsUsedSelectedValues()
      } else {
        handleGetProductsUsedSearchData()
      }
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    if (pagination && currentStatus === 'search') {
      countLoadingPage > 0 && handleGetProductsUsedSearchData()
      countLoadingPage === 0 && handleGetProductsUsedSelectedValues()
    }
  }, [pagination, currentStatus, searchCount])

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({
        ...defaultTablePaginationSortByErpIdPerPage,
        rows: 1000,
      })
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
    if (countLoadingPage === 0) return
    handleUpdateSelectedOrgsUrlParams(selectedOrganizations)
  }, [selectedOrganizations])

  useCommonAccesibility()

  usePreviousPage('apps-products', {})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.products}></SeoConfig>
      <Row>
        <PageTitle title={t('products_page_title')} />
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
                    callback={() => setCountLoadingPage(countLoadingPage + 1)}
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
          value={products}
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
            _.isEmpty(products) ? t('products_table_empty_message') : undefined
          }
          paginatorLeft={paginatorLeft}
          lazy
          onSort={onSort}
          onPage={handleChangePage}
          resizableColumns
          columnResizeMode='fit'
        >
          <Column
            header={t('products_column_header_id')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('products_column_header_name')}
            field='name'
            sortable
            body={(data: IProducts) => (
              <FieldTextDataTable value={data.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('products_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default Products
