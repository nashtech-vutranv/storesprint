import {useState, useEffect, useContext} from 'react'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {Col, Row, Button} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {InputText} from 'primereact/inputtext'
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import SitesService from '../../services/SitesService'
import {TemplatePaginator} from '../../components/Paginator'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {ISite, IUrlParams} from '../../interface'
import {GlobalContext} from '../../store/GlobalContext'
import {capitalizeFirstLetter, getURLParamsObj} from '../../helpers'
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb'
import {usePagination, useCommonAccesibility, useHandleError, usePreviousPage} from '../../hooks'
import {SiteActionType, RowTableActionType} from '../../store/actions'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {PERMISSIONS, ROUTE_ORG, ROUTE_PARAMS, ROUTE_SITE} from '../../constants'
import {AddButton} from '../../components'

const OrganizationsSites = () => {
  const {orgId} = useParams<{orgId: string}>()

  const [sites, setSites] = useState<ISite[]>([])
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const {t} = useTranslation()

  const {
    state: {axiosClient, organization},
    dispatch: {site: siteDispatch, rowTable: rowTableDispatch},
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
  } = usePagination(undefined, true)

  const refreshInitialState = () => {
    setKeyword('')
    setPagination({
      ...defaultPagination,
      sortField: pagination && pagination.sortField,
      sortOrder: pagination && pagination.sortOrder,
    })
    rowTableDispatch({
      type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES,
      payload: 10,
    })
  }

  useEffect(() => {
    pagination &&
      new SitesService(axiosClient)
        .getSitesByOrganization(orgId, pagination)
        .then((response: any) => {
          const siteLocalesData = response.data.content.map((site: any) => {
            return {...site, status: capitalizeFirstLetter(site.status)}
          })
          setSites(siteLocalesData)
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [pagination])

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

  useCommonAccesibility()

  usePreviousPage('apps-site', {})

  const templateLamda = TemplatePaginator('sample_lamda')

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    siteDispatch({
      type: SiteActionType.GET_SITE_INFORMATION,
      payload: e.value,
    })
    orgId &&
      navigate(
        ROUTE_SITE.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId).replace(
          ROUTE_PARAMS.SITE_ID,
          e.value.id
        )
      )
  }

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex justify-content-start align-items-center'>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8} className='btn-mr-1'>
            <InputText
              value={keyword}
              onChange={onKeywordChange}
              onBlur={onBlurInputSearch}
              onKeyDown={(event) => event.key === 'Enter' && onSearch()}
              placeholder={t('common_input_search_placeHolder')}
              className='w-100'
            />
          </Col>
          <Button onClick={onSearch} className='btn-h-95'>
            {t('common_button_search_label')}
          </Button>
        </div>
      </Row>
    )
  }

  const directToAddSitePage = () => {
    orgId && navigate(ROUTE_SITE.ADD.replace(ROUTE_PARAMS.ORG_ID, orgId))
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
      onClick={directToAddSitePage}
      label={t('sites_button_add_site_label')}
      permissions={[PERMISSIONS.view_organization_list, PERMISSIONS.add_site]}
    ></AddButton>
  )

  return (
    <>
      <SeoConfig seoProperty={seoProperty.organizationsSite}></SeoConfig>
      <Row>
        <Col>
          <div className='page-title-box'>
            {orgId && (
              <BreadCrumb
                breadCrumbItems={[
                  {
                    label: organization ? organization.name : orgId,
                    active: false,
                    path: ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId),
                  },
                  {label: t('sites_pate_title'), active: true},
                ]}
              />
            )}
            <h4 className='page-title'>{t('sites_pate_title')}</h4>
          </div>
        </Col>

        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={sites}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          selectionMode='single'
          onSelectionChange={(e) => onSelectionChange(e)}
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={t('sites_table_empty_message')}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('sites_column_header_erpId')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('sites_column_header_name')}
            field='name'
            sortable
            body={(siteLocales: ISite) => (
              <FieldTextDataTable value={siteLocales.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('sites_column_header_url')}
            field='url'
            sortable
            className='text-break'
            body={(siteLocales: ISite) => (
              <FieldTextDataTable value={siteLocales.url} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('sites_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default OrganizationsSites
