import {useState, useEffect, useContext} from 'react'
import {Button as ButtonPrime} from 'primereact/button'
import {Column} from 'primereact/column'
import {InputText} from 'primereact/inputtext'
import {Col, Row, Button} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {useNavigate, useParams} from 'react-router-dom'
import ResourceService from '../../../services/ResourceService'
import {TemplatePaginator} from '../../../components/Paginator'
import SeoConfig from '../../../components/SEO/SEO-Component'
import {seoProperty} from '../../../constants/seo-url'
import {IResource} from '../../../interface/resource'
import {GlobalContext} from '../../../store/GlobalContext'
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb'
import {usePagination, useCommonAccesibility, useHandleError} from '../../../hooks'
import {defaultAssignedResourceTablePaginationPerPage} from '../../../constants/pagination'
import {ResourceActionType, RowTableActionType} from '../../../store/actions'
import FieldTextDataTable from '../../../components/FieldTextDataTable/FieldTextDataTable'
import {ROUTE_USER, ROUTE_PARAMS, ROUTE_RESOURCE} from '../../../constants'

const ViewAssignedResources = () => {
  const {userId} = useParams<{userId: string}>()

  const [resources, setResouces] = useState<IResource[]>([])

  const navigate = useNavigate()

  const {t} = useTranslation()

  const {
    state: {axiosClient, user},
    dispatch: {resource: resourceDispatch, rowTable: rowTableDispatch},
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
  } = usePagination(defaultAssignedResourceTablePaginationPerPage)

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

  useEffect(() => {
    userId &&
      pagination &&
      new ResourceService(axiosClient)
        .getResoucesByUserId(userId, pagination)
        .then((response: any) => {
          setResouces(
            response.data.content.map((resource: any) =>
              resource.siteResponse === null
                ? {
                    ...resource,
                    siteResponse: {
                      ...resource.siteResponse,
                      name: t('resource_all_site_label'),
                    },
                  }
                : resource
            )
          )
          setTotalRecords(response.data.totalElements)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [userId, pagination])

  useCommonAccesibility()

  const templateLamda = TemplatePaginator('sample_lamda')

  const onSelectionChange = (e: DataTableSelectionChangeParams) => {
    resourceDispatch({
      type: ResourceActionType.GET_RESOURCE_INFORMATION,
      payload: {
        ...e.value,
        siteResponse:
          e.value.siteResponse.name === t('resource_all_site_label')
            ? null
            : e.value.siteResponse,
      },
    })
    userId &&
      navigate(
        ROUTE_RESOURCE.EDIT.replace(ROUTE_PARAMS.USER_ID, userId).replace(
          ROUTE_PARAMS.RESOURCE_ID,
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

  const directToAddResourcePage = () => {
    userId && navigate(ROUTE_RESOURCE.ADD.replace(ROUTE_PARAMS.USER_ID, userId))
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
    <Button onClick={directToAddResourcePage} type='button' variant='success'>
      <i className='pi pi-plus'></i>{' '}
      <span>{t('resources_button_add_resource_label')}</span>
    </Button>
  )

  return (
    <>
      <SeoConfig seoProperty={seoProperty.resources}></SeoConfig>
      <Row>
        <Col>
          {userId && (
            <BreadCrumb
              origin='users'
              breadCrumbItems={[
                {
                  label: user.fullName ? user.fullName : 'username',
                  active: false,
                  path: ROUTE_USER.EDIT.replace(ROUTE_PARAMS.USER_ID, userId),
                },
                {label: t('resources_page_title'), active: true},
              ]}
            />
          )}
          <h4 className='page-title'>{t('resources_page_title')}</h4>
        </Col>

        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={resources}
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
          emptyMessage={t('resources_table_empty_message')}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
        >
          <Column
            header={t('resources_column_header_organization')}
            field='organizationResponse.name'
            sortable
            body={(resourcesData: IResource) => (
              <FieldTextDataTable
                value={resourcesData.organizationResponse.name}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            header={t('resources_column_header_site')}
            field='siteResponse.name'
            sortable
            body={(resourcesData: IResource) => (
              <FieldTextDataTable
                value={resourcesData.siteResponse.name}
                placement='bottom'
              />
            )}
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default ViewAssignedResources
