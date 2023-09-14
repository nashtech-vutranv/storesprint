import {useState, useEffect, useRef, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Col, Row, Button} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {Button as ButtonPrime} from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import {IUser} from '../../interface/user'
import UserService from '../../services/UserService'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {TemplatePaginator} from '../../components/Paginator'
import {usePagination, useCommonAccesibility, useHandleError} from '../../hooks'
import {transformToSelectData} from '../../helpers/select'
import OrganizationService from '../../services/OrganizationService'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {ROUTE_USER, ROUTE_PARAMS} from '../../constants'
import FilterCard from '../../components/FilterCard/FilterCard'
import SiteServices from '../../services/SitesService'
import {defaultUsersTablePaginationPerPage} from '../../constants/pagination'
import {GlobalContext} from '../../store/GlobalContext'
import {
  UserActionType,
  RowTableActionType,
  PagesInfoActionType,
} from '../../store/actions'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import PageTitle from '../../components/PageTitle/PageTitle'

const Users = () => {
  const [keepFilter, setKeepFilter] = useState(
    Boolean(window.history.state.usr?.keepFilter) || false
  )
  const organizationState = window.history.state.usr?.selectedOrganization
  const sitesState = window.history.state.usr?.selectedSites

  const {
    state: {
      pagesInfo: {
        user: {searchData},
      },
    },
    dispatch: {
      user: userDispatch,
      rowTable: rowTableDispatch,
      pagesInfo: pagesInfoDispatch,
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const [users, setUsers] = useState<IUser[]>([])
  const {t} = useTranslation()
  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()

  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectedOrganization, setSelectedOrganization] = useState<any>(
    null
  )
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectedSites, setSelectedSites] = useState<any>(
    // Array.isArray(sitesState) ? sitesState : []
    []
  )

  const [filterCount, setFilterCount] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [currentStatus, setCurrentStatus] = useState<'apply' | 'search' | null>(
    null
  )
  const [isAllDataFetched, setIsAllDataFetched] = useState<boolean>(true)
  const navigate = useNavigate()

  const {
    dataApi: {keyword, pagination, axiosClient, defaultPagination},
    dataTable: {
      totalRecords,
      setTotalRecords,
      onPage,
      onSort,
      onSearch,
      onKeywordChange,
      onBlurInputSearch,
      setPagination,
      setKeyword,
    },
  } = usePagination(defaultUsersTablePaginationPerPage)

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

  const bindingUsers = (response: any) => {
    const userData = response.data.content.map((user: any) => {
      return {
        ...user,
        status: capitalizeFirstLetter(user.status),
        fullName: `${user.firstName} ${user.lastName}`,
      }
    })
    setUsers(userData)
    setTotalRecords(response.data.totalElements)
  }

  useEffect(() => {
    if (keepFilter) {
      new UserService(axiosClient)
        .getUsersByFilter(
          {...defaultUsersTablePaginationPerPage},
          {
            orgId: organizationState?.value ? organizationState.value : null,
            siteIds: sitesState.map((site: any) => site.value),
            keyword: keyword,
          }
        )
        .then((response: any) => {
          bindingUsers(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [])

  useEffect(() => {
    new OrganizationService(axiosClient)
      .getAllOrganizations({...pagination, rows: 1000})
      .then((response: any) => {
        setSelectOrganizationOptions(
          transformToSelectData(response.data.content)
        )
        const selected = organizationState ? organizationState : null
        setSelectedOrganization(selected)
        if (keepFilter) {
          selectOrganizationRef.current.setValue(selected)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (!_.isEmpty(selectedOrganization)) {
      new SiteServices(axiosClient)
        .getSitesFromMultiOrganizations(
          {
            organizationIds: [selectedOrganization.value],
          },
          {
            ...pagination,
            rows: 1000,
          }
        )
        .then((response: any) => {
          setSelectSiteOptions(transformToSelectData(response.data.content))
          const selected = Array.isArray(sitesState) ? sitesState : []
          setSelectedSites(selected)
          if (keepFilter) {
            selectSiteRef.current.setValue(selected)
          }
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      selectSiteRef.current.clearValue()
      setSelectSiteOptions([])
    }
  }, [selectedOrganization])

  useEffect(() => {
    if (currentStatus === 'apply' && pagination) {
      new UserService(axiosClient)
        .getUsersByFilter(pagination, {
          orgId: selectedOrganization?.value
            ? selectedOrganization.value
            : null,
          siteIds: selectedSites.map((site: any) => site.value),
          keyword: keyword,
        })
        .then((response: any) => {
          bindingUsers(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, filterCount, currentStatus])

  useEffect(() => {
    currentStatus === 'search' &&
      pagination &&
      (isAllDataFetched ||
        (searchData &&
          searchData.selectedOrganization &&
          !_.isEmpty(searchData.selectedOrganization))) &&
      new UserService(axiosClient)
        .getUsersByFilter(pagination, {
          orgId: !isAllDataFetched
            ? searchData.selectedOrganization.value
            : null,
          siteIds: !isAllDataFetched
            ? searchData.selectedSites.map((site: any) => site.value)
            : [],
          keyword: keyword,
        })
        .then((response: any) => {
          bindingUsers(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [pagination, searchCount, currentStatus, isAllDataFetched])

  useEffect(() => {
    if (
      isAllDataFetched &&
      currentStatus === null &&
      pagination || keepFilter
    ) {
      new UserService(axiosClient)
        .getUsersByFilter(_.omit(pagination, ['keyword']), {
          orgId: null,
          siteIds: null,
          keyword: keyword,
        })
        .then((response: any) => {
          bindingUsers(response)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [pagination, isAllDataFetched, currentStatus, keepFilter])

  useCommonAccesibility()

  const directToAddUserPage = () => {
    navigate(ROUTE_USER.ADD, {
      state: {
        selectedOrganization:
          isAllDataFetched && !keepFilter
            ? null
            : searchData.selectedOrganization,
        selectedSites:
          isAllDataFetched && !keepFilter ? [] : searchData.selectedSites,
      },
    })
  }

  const onGetFiltersProductsData = () => {
    if (isAllDataFetched) {
      setIsAllDataFetched(false)
    }
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_USER_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization: selectedOrganization,
        selectedSites,
      },
    })
    setCurrentStatus('apply')
    setKeyword('')
    setFilterCount(filterCount + 1)
  }

  const onClearCurrentFilters = () => {
    selectOrganizationRef.current.clearValue()
    selectSiteRef.current.clearValue()
    setIsAllDataFetched(true)
    setCurrentStatus(null)
    setKeyword('')
    setKeepFilter(false)
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_USER_PAGE_SEARCH_DATA,
      payload: {
        selectedOrganization: null,
        selectedSites: [],
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
      className='p-button-text refresh-button'
      onClick={refreshInitialState}
      tooltip={t('common_button_refresh_table')}
      data-testid='refresh-button'
    />
  )

  const paginatorRight = (
    <Button onClick={directToAddUserPage} type='button' variant='success'>
      <i className='pi pi-plus'></i> <span>{t('user_paginator_add_user')}</span>
    </Button>
  )

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    userDispatch({
      type: UserActionType.GET_USER_INFORMATION,
      payload: e.value,
    })

    navigate(ROUTE_USER.EDIT.replace(ROUTE_PARAMS.USER_ID, e.value.id), {
      state: {
        selectedOrganization: isAllDataFetched && !keepFilter
          ? null
          : searchData.selectedOrganization,
        selectedSites: isAllDataFetched && !keepFilter ? [] : searchData.selectedSites,
      },
    })
  }

  return (
    <>
      <SeoConfig seoProperty={seoProperty.users}></SeoConfig>
      <Row>
        <PageTitle title={t('user_page_title')}/>
        <Col xs={12}>
          <FilterCard
            name='user'
            defaultActiveKey={keepFilter && !_.isEmpty(organizationState) ? 'filter-accordion' : undefined}
          >
            <Row className='align-items-center pb-2'>
              <Col xs={2}>
                <label htmlFor='organization-name'>
                  {t('products_filter_organization_label')}
                </label>
              </Col>
              <Col xs={6}>
                <Select
                  options={selectOrganizationOptions}
                  placeholder={t('products_filter_organization_placeHolder')}
                  isSearchable
                  onChange={setSelectedOrganization}
                  ref={selectOrganizationRef}
                  className='react-select'
                  classNamePrefix='react-select'
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
                  onChange={setSelectedSites}
                  ref={selectSiteRef}
                  className='react-select'
                  classNamePrefix='react-select'
                />
              </Col>
            </Row>

            <Row>
              <Col xs={7} className='text-center'>
                <Button
                  className='me-2'
                  variant='danger'
                  onClick={onClearCurrentFilters}
                >
                  {t('common_button_reset_label')}
                </Button>
                <Button variant='success' onClick={onGetFiltersProductsData}>
                  {t('common_button_apply_label')}
                </Button>
              </Col>
            </Row>
          </FilterCard>
        </Col>

        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={users}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          onSelectionChange={(e) => onSelectionChange(e)}
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={t('user_table_empty_message')}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('column_header_erpId')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('column_header_name')}
            field='fullName'
            sortable
            body={(usersData: IUser) => (
              <FieldTextDataTable
                value={usersData.fullName}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('column_header_email_address')}
            field='emailAddress'
            sortable
            body={(usersData: IUser) => (
              <FieldTextDataTable
                value={usersData.emailAddress}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
export default Users
