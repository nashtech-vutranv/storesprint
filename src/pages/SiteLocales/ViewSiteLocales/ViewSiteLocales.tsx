import {useEffect, useState, useContext} from 'react'
import {Row, Col, Button} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useParams, useNavigate, useSearchParams} from 'react-router-dom'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {InputText} from 'primereact/inputtext'
import {Button as ButtonPrime} from 'primereact/button'
import {ISiteLocale, IUrlParams} from '../../../interface'
import SiteServices from '../../../services/SitesService'
import SeoConfig from '../../../components/SEO/SEO-Component'
import {seoProperty} from '../../../constants/seo-url'
import {TemplatePaginator} from '../../../components/Paginator'
import {capitalizeFirstLetter, getURLParamsObj} from '../../../helpers'
import {
  usePagination,
  useCommonAccesibility,
  useHandleError,
  usePreviousPage
} from '../../../hooks'
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb'
import {GlobalContext} from '../../../store/GlobalContext'
import {RowTableActionType} from '../../../store/actions'
import FieldTextDataTable from '../../../components/FieldTextDataTable/FieldTextDataTable'
import {
  ROUTE_SITE_LOCALE,
  ROUTE_PARAMS,
  ROUTE_SITE,
  ROUTE_ORG,
  PERMISSIONS,
} from '../../../constants'
import {AddButton} from '../../../components'

const ViewSiteLocales = () => {
  const {orgId, siteId} = useParams<{orgId: string; siteId: string}>()

  const navigate = useNavigate()
  const {t} = useTranslation()

  const [siteLocales, setSiteLocales] = useState<ISiteLocale[]>([])
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )

  const [, setSearchParams] = useSearchParams()

  const {
    state: {axiosClient, organization, site},
    dispatch: {rowTable: rowTableDispatch},
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

  const templateDelta = TemplatePaginator('sample_lamda')

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
              onKeyDown={(event) => event.key === 'Enter' && onSearch()}
            />
          </Col>
          <Button onClick={onSearch} className='btn-h-95'>
            {t('common_button_search_label')}
          </Button>
        </div>
      </Row>
    )
  }

  const updateSiteLocalesData = () => {
    if (siteId && pagination) {
      new SiteServices(axiosClient)
        .getSiteLocales(siteId, pagination)
        .then((response: any) => {
          const siteLocalesData = response.data.content.map(
            (siteLocale: any) => {
              return {
                ...siteLocale,
                status: capitalizeFirstLetter(siteLocale.status),
              }
            }
          )
          setSiteLocales(siteLocalesData)
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
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
      className='p-button-text refresh-button'
      onClick={refreshInitialState}
      tooltip={t('common_button_refresh_table')}
    />
  )

  const addSiteButton = (
    <AddButton
      onClick={() =>
        orgId &&
        siteId &&
        navigate(
          ROUTE_SITE_LOCALE.ADD.replace(ROUTE_PARAMS.ORG_ID, orgId).replace(
            ROUTE_PARAMS.SITE_ID,
            siteId
          )
        )
      }
      label={t('organization_site_locale_add_label')}
      permissions={[
        PERMISSIONS.view_organization_list,
        PERMISSIONS.view_site_list,
        PERMISSIONS.add_locale,
      ]}
    ></AddButton>
  )

  useEffect(() => {
    updateSiteLocalesData()
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

  usePreviousPage('apps-locale', {})

  useCommonAccesibility()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.siteLocales}></SeoConfig>
      <Row>
        <Col>
          <div className='page-title-box'>
            {orgId && siteId && (
              <BreadCrumb
                breadCrumbItems={[
                  {
                    label: organization ? organization.name : orgId,
                    active: false,
                    path: ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId),
                  },
                  {
                    label: t('sites_pate_title'),
                    active: false,
                    path: ROUTE_SITE.ROOT.replace(ROUTE_PARAMS.ORG_ID, orgId),
                  },
                  {
                    label: site.name,
                    active: false,
                    path: ROUTE_SITE.EDIT.replace(
                      ROUTE_PARAMS.ORG_ID,
                      orgId
                    ).replace(ROUTE_PARAMS.SITE_ID, siteId),
                  },
                  {
                    label: t('siteLocales_page_title'),
                    active: true,
                  },
                ]}
              />
            )}
            <h4 className='page-title'>{t('siteLocales_page_title')}</h4>
          </div>
        </Col>
        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={siteLocales}
          paginator
          paginatorTemplate={templateDelta}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          responsiveLayout='scroll'
          selectionMode='single'
          onSelectionChange={(e) =>
            orgId &&
            siteId &&
            navigate(
              ROUTE_SITE_LOCALE.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId)
                .replace(ROUTE_PARAMS.SITE_ID, siteId)
                .replace(ROUTE_PARAMS.SITE_LOCALE_ID, e.value.id)
            )
          }
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={t('siteLocales_table_empty_message')}
          paginatorLeft={paginatorLeft}
          paginatorRight={addSiteButton}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('siteLocales_column_header_erpId')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('organization_column_header_locale')}
            field='name'
            sortable
          ></Column>
          <Column
            field='url'
            header={t('organization_column_header_url')}
            sortable
            className='text-break'
            body={(siteLocale: ISiteLocale) => (
              <FieldTextDataTable value={siteLocale.url} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('organization_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default ViewSiteLocales
