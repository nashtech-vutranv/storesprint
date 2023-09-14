import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {Button, Card} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useLocation, useNavigate} from 'react-router-dom'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  IImportProductPropertiesResult,
  IInvalidProperties,
} from '../../interface'
import {ROUTE_PRODUCT_PROPERTIES} from '../../constants'

const ImportResult = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as IImportProductPropertiesResult

  const handleRedirectToProductPropertiesList = () => {
    navigate(ROUTE_PRODUCT_PROPERTIES.ROOT)
  }
  return (
    <>
      <SeoConfig seoProperty={seoProperty.importResult}></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('import_product_properties_result_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <div>
            <p>
              {t('import_product_properties_result_insert_succesfully', {
                result: `${state?.success || 0}/${state?.total || 0}`,
                interpolation: {escapeValue: false},
              })}
            </p>
            <p>
              {t('import_product_properties_result_invalid_properties', {
                result: state ? state.total - state.success : 0,
              })}
            </p>
          </div>

          <div className='mt-2'>
            <DataTable
              value={state ? state.invalidProperties : []}
              responsiveLayout='scroll'
              className='data-table-mh'
              emptyMessage={t('import_product_properties_result_empty_message')}
            >
              <Column
                field='lineNumber'
                header={t('import_product_properties_result_field_row_number')}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable
                    value={inv.lineNumber.toString()}
                    placement='bottom'
                  />
                )}
              ></Column>
              <Column
                field='erpId'
                header={t('import_product_properties_result_erpId')}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable value={inv.erpId} placement='bottom' />
                )}
              ></Column>
              <Column
                field='name'
                header={t('import_product_properties_result_name')}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable value={inv.name} placement='bottom' />
                )}
              ></Column>
              <Column
                field='type'
                header={t('import_product_properties_result_data_type')}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable value={inv.type} placement='bottom' />
                )}
              ></Column>
              <Column
                field='isLocaleSensitive'
                header={t(
                  'import_product_properties_result_is_locale_sensitive'
                )}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable
                    value={inv.isLocaleSensitive}
                    placement='bottom'
                  />
                )}
              ></Column>
              <Column
                field='status'
                header={t('import_product_properties_result_status')}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable value={inv.status} placement='bottom' />
                )}
              ></Column>
              <Column
                field='failedReason'
                header={t(
                  'import_product_properties_result_import_failed_reason'
                )}
                body={(inv: IInvalidProperties) => (
                  <FieldTextDataTable
                    value={inv.failedReason}
                    placement='bottom'
                  />
                )}
              ></Column>
            </DataTable>
          </div>

          <div className='d-flex justify-content-center mt-2'>
            <Button
              variant='success'
              className='me-2'
              onClick={handleRedirectToProductPropertiesList}
            >
              {t('common_ok')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default ImportResult
