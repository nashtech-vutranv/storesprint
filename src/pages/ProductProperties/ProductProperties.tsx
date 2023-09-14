import {useState, useEffect, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import _ from 'lodash'
import {DataTable, DataTableSelectionChangeParams} from 'primereact/datatable'
import {Row, Col, Button} from 'react-bootstrap'
import {Column} from 'primereact/column'
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {Button as ButtonPrime} from 'primereact/button'
import {
  PERMISSIONS,
  ROUTE_IMPORT_PRODUCT_PROPERTIES,
  ROUTE_PARAMS,
  ROUTE_PRODUCT_PROPERTIES,
} from '../../constants'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {TemplatePaginator} from '../../components/Paginator'
import {usePagination, useCommonAccesibility, useHandleError, usePreviousPage} from '../../hooks'
import {IProducProperties} from '../../interface/productProperties'
import PageTitle from '../../components/PageTitle/PageTitle'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {capitalizeFirstLetter} from '../../helpers/characters'
import {RowTableActionType} from '../../store/actions'
import {GlobalContext} from '../../store/GlobalContext'
import {defaultTablePaginationSortByErpIdPerPage} from '../../constants/pagination'
import {AddButton} from '../../components'
import {getURLParamsObj} from '../../helpers'
import {IUrlParams} from '../../interface'
import Searching from '../../components/Searching'

interface ITableProductProperties
  extends Omit<IProducProperties, 'localeSensitive' | 'status'> {
  localeSensitive: string
}

const ProductProperties = () => {
  const [productProperties, setProductProperties] = useState<
    ITableProductProperties[]
  >([])
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedURLParamsObj, setSelectedURLParamsObj] = useState<IUrlParams>(
    getURLParamsObj()
  )
  const [, setSearchParams] = useSearchParams()

  const {
    state: {
      permissionInformations: {checkHasPermissions},
    },
    dispatch: {rowTable: rowTableDispatch},
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
      onSearch()
    }
  }

  const transferDataProductProperties = (data: IProducProperties[]) => {
    return data.map((item) => ({
      ...item,
      status: capitalizeFirstLetter(item.status),
      localeSensitive: item.localeSensitive ? 'Yes' : 'No',
    }))
  }

  const handleSelection = (e: DataTableSelectionChangeParams) => {
    navigate(
      ROUTE_PRODUCT_PROPERTIES.EDIT.replace(
        ROUTE_PARAMS.PRODUCT_PROPERTY_ID,
        e.value.id
      ),
      {
        state: {
          viewlistLocation: location,
        },
      }
    )
  }

  const handleGetProductsSuccessResponse = (response: any) => {
    if (response.data && response.data.content) {
      setProductProperties(transferDataProductProperties(response.data.content))
      setTotalRecords(response.data.totalElements)
    }
  }

  const handleExportCsvFile = async () => {
    const result = await new ProductPropertiesService(
      axiosClient
    ).exportProductProperties()
    const contentDisposition = result.headers['content-disposition']
    const fileName = contentDisposition.split('filename=')[1]
    const link = document.createElement('a')
    const url = window.URL.createObjectURL(result.data)
    link.href = url
    link.download = fileName
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    pagination &&
      new ProductPropertiesService(axiosClient)
        .getProductProperties(
          {
            ...pagination,
          },
          {
            search: keyword,
          }
        )
        .then((response: any) => {
          handleGetProductsSuccessResponse(response)
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

  usePreviousPage('apps-product-properties', {})

  const templateLamda = TemplatePaginator('sample_lamda')

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex'>
          <div className='d-flex justify-content-start align-items-center w-full'>
            <Col
              xs={8}
              sm={8}
              md={8}
              lg={7}
              xl={7}
              xxl={7}
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
                setSelectedURLParamsObj={setSelectedURLParamsObj}
                selectedURLParamsObj={selectedURLParamsObj}
              />
            </Col>
            <Button onClick={onSearch} className='btn-h-95'>
              {t('common_button_search_label')}
            </Button>
          </div>
          <div
            style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}
          >
            {checkHasPermissions &&
              checkHasPermissions([PERMISSIONS.view_product_property_list]) && (
                <Button
                  onClick={handleExportCsvFile}
                  type='button'
                  variant='secondary'
                  className='btn-h-95'
                >
                  <i
                    className='pi pi-download'
                    style={{marginRight: '0.5rem'}}
                  ></i>
                  <span>
                    {t('product_properties_download_all_properties_label')}
                  </span>
                </Button>
              )}
            {checkHasPermissions &&
              checkHasPermissions([PERMISSIONS.add_product_property]) && (
                <Button
                  onClick={() => navigate(ROUTE_IMPORT_PRODUCT_PROPERTIES.ROOT)}
                  type='button'
                  variant='success'
                  style={{marginLeft: '0.75rem'}}
                  className='btn-h-95'
                >
                  <span>{t('product_properties_import_label')}</span>
                  <i
                    className='mdi mdi-file-import-outline'
                    style={{marginLeft: '0.5rem'}}
                  ></i>
                </Button>
              )}
          </div>
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
      onClick={() =>
        navigate(ROUTE_PRODUCT_PROPERTIES.ADD, {
          state: {
            search: keyword.trim(),
          },
        })
      }
      permissions={[PERMISSIONS.add_product_property]}
      label={t('product_properties_add_label')}
    />
  )

  return (
    <>
      <SeoConfig seoProperty={seoProperty.products}></SeoConfig>
      <Row>
        <PageTitle title={t('product_properties_page_title')} />
        <DataTable
          sortField={pagination && pagination.sortField}
          sortOrder={pagination && pagination.sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={productProperties}
          paginator
          paginatorTemplate={templateLamda}
          first={pagination && pagination.first}
          rows={pagination && pagination.rows}
          onSelectionChange={(e) => handleSelection(e)}
          responsiveLayout='scroll'
          selectionMode='single'
          header={renderHeader}
          className='data-table-mh'
          paginatorClassName='table-paginator'
          emptyMessage={
            _.isEmpty(productProperties)
              ? t('product_properties_table_empty_message')
              : undefined
          }
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          lazy
          onSort={onSort}
          onPage={onPage}
          resizableColumns
          columnResizeMode='fit'
        >
          <Column
            header={t('product_properties_column_header_erpId')}
            field='erpId'
            sortable
          ></Column>
          <Column
            header={t('product_properties_column_header_name')}
            field='name'
            sortable
            body={(data: ITableProductProperties) => (
              <FieldTextDataTable value={data.name} placement='bottom' />
            )}
          ></Column>
          <Column
            header={t('product_properties_column_header_type')}
            field='type'
            sortable
          ></Column>
          <Column
            header={t('product_properties_column_header_locale_sensitive')}
            field='localeSensitive'
            sortable
          ></Column>
          <Column
            header={t('product_properties_column_header_status')}
            field='status'
            sortable
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}

export default ProductProperties
