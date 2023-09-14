import {useState, useEffect, useContext, useRef} from 'react'
import {useNavigate, useLocation, useParams} from 'react-router-dom'
import {Card, Col, Container, Row, Button} from 'react-bootstrap'
import Select from 'react-select'
import {useTranslation} from 'react-i18next'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useCallbackPrompt, usePersistLocationState, useCommonAccesibility, useHandleError} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import ProductPropertyMappingsService from '../../services/ProductPropertyMappingsService'
import {GlobalContext} from '../../store/GlobalContext'
import {PagesInfoActionType} from '../../store/actions'
import {
  transformMarketplaceProductPropertyFormData,
  renderUnitType
} from '../../helpers'
import {
  IUpdateProductCategoryMapping,
  ISelectOption,
  IUpdateProductPropertyMapping,
  IProductPropertyMappings,
} from '../../interface'
import {ToastContext} from '../../providers'
import {ROUTE_PRODUCT_PROPERTY_MAPPINGS, ROUTE_PARAMS} from '../../constants'
import BreadCrumb, {BreadcrumbItems} from '../../components/BreadCrumb'

export default function EditProductPropertyMapping() {
  const {t} = useTranslation()

  const {
    marketplaceTypeId: marketplaceTypeIdParam,
    mappingTargetId,
    productPropertyAttributeId,
  } = useParams()

  const location = useLocation() as any
  const {state: persistState} = usePersistLocationState(location)

  const {
    state: {
      axiosClient,
      pagesInfo: {
        productPropertyMappings: {
          selectedRowData: {
            selectedMarketplaceTypeName: selectedMarketplaceTypeNameState,
            selectedMarketplaceProductProperty:
              selectedMarketplaceProductPropertyState,
          },
        },
      },
    },
    dispatch: {pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const navigate = useNavigate()

  const [selectedMarketplaceValue, setSelectedMarketplaceValue] =
    useState<ISelectOption | null>(null)
  const [selectedMMSProductProperty, setSelectedMMSProductProperty] = useState<
    (ISelectOption & {erpId: string, propertyId: string}) | null
  >(null)
  const [mmsProductPropertyOptions, setMMSProductPropertyOptions] = useState<
    Array<ISelectOption & {erpId: string, propertyId: string}>
  >([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShouldPreventCancelEditForm, setIsShouldPreventCancelEditForm] =
    useState<boolean>(false)
  const [countChangeMMSProductProperty, setCountChangeMMSProductProperty] =
    useState<number>(0)
  const [isEnumExistedInProductAttribute, setIsEnumExistedInProductAttribute] =
    useState<boolean>(false)
  const [isShouldDisabledValueMappingButton, setIsShouldDisabledValueMappingButton] = 
    useState<boolean>(false)

  const initialValueFormRef = useRef<IUpdateProductPropertyMapping>({
    version: 0,
    marketplaceTypeId: '',
    mmsValue: '',
    marketplaceValue: '',
    marketplaceCode: null,
  })

  const getProductPropertyAttribute = async (attributeId: string) => {
    try {
      const productPropertyResponse = await new ProductPropertyMappingsService(
        axiosClient
      ).getProductPropertyAttribute(attributeId)
      const {
        mappingResponse: {marketplaceValue, mmsValue, version},
        attributeResponse: {marketplaceCode, marketplaceTypeId, isEnum, value},
        propertyResponse: {name = '', erpId, id: propertyId}
      } = productPropertyResponse.data as IProductPropertyMappings
      setSelectedMarketplaceValue({
        label: `${marketplaceValue} ${renderUnitType(value)}`,
        value: marketplaceValue,
      })
      setSelectedMMSProductProperty({
        label: name,
        value: erpId,
        erpId: erpId,
        propertyId
      })
      setIsEnumExistedInProductAttribute(isEnum)
      resetForm({
        values: {
          marketplaceValue,
          mmsValue,
          marketplaceCode,
          marketplaceTypeId,
          version,
        },
      })
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const getMMSProductPropertyOptions = async () => {
    try {
      const mmsProductPropertiesResponse = await new ProductPropertiesService(
        axiosClient
      ).getProductProperties(
        {
          page: 1,
          rows: 1000,
        },
        {
          search: '',
        }
      )
      setMMSProductPropertyOptions(
        transformMarketplaceProductPropertyFormData(
          mmsProductPropertiesResponse.data.content
        )
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const showProductPropertyMappingSuccessUpdated = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('product_property_mapping_edit_success_message'),
      life: 5000,
    })
  }

  const handleUpdateProductPropertyMappingError = (_err: any) => {
    setErrorMessage(t('product_property_mapping_duplicate_error_message'))
  }

  const handleChangeMMSProductProperty = (
    _selectedProductProperty: (ISelectOption & {erpId: string, propertyId: string}) | null
  ) => {
    setErrorMessage(null)
    setIsShouldDisabledValueMappingButton(true)
    setCountChangeMMSProductProperty(countChangeMMSProductProperty + 1)
    setSelectedMMSProductProperty(_selectedProductProperty)
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    errors,
    touched,
    dirty,
    resetForm,
  } = useFormik<IUpdateProductPropertyMapping>({
    initialValues: initialValueFormRef.current,
    onSubmit: (requestData) => {
      setSubmitting(true)
      setIsShouldPreventCancelEditForm(true)
      productPropertyAttributeId &&
        new ProductPropertyMappingsService(axiosClient)
          .editProductPropertyMapping(productPropertyAttributeId, requestData)
          .then((_response) => {
            setSubmitting(false)
            showProductPropertyMappingSuccessUpdated()
            setIsShouldDisabledValueMappingButton(false)
            if (!isEnumExistedInProductAttribute) {
              handleNavigateBackToProductPropertyMappingList()
            }
          })
          .catch((err) => {
            setSubmitting(false)
            setIsShouldDisabledValueMappingButton(false)
            handleErrorResponse(
              err,
              handleUpdateProductPropertyMappingError
            )
          })
    },
    validate: (validateData: IUpdateProductCategoryMapping) => {
      let validErrors: any = {}
      if (!validateData.mmsValue) {
        validErrors.mmsValue = t('form_validate_required')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IUpdateProductCategoryMapping) => {
    return !!(touched[name] && errors[name])
  }

  const resetProductPropertyMappingPushData = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PUSH_DATA,
      payload: {
        selectedtMarketplaceProductProperty: null,
        selectedMarketplaceCode: null,
        selectedMarketplaceTypeId: null,
      },
    })
  }

  const handleNavigateBackToProductPropertyMappingList = () => {
    resetProductPropertyMappingPushData()
    navigate(
      ROUTE_PRODUCT_PROPERTY_MAPPINGS.ROOT
        .replace(ROUTE_PARAMS.MARKETPLACE_TYPE_ID, marketplaceTypeIdParam || '')
        .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || ''),
      {
        state: persistState,
      }
    )
  }

  const handleNavigateToValueMapping = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_ENUM_VALUE_MAPPINGS_SELECTED_DATA,
      payload: {
        selectedMarketplaceTypeId: marketplaceTypeIdParam,
        selectedPropertyName: selectedMarketplaceValue
          ? selectedMarketplaceValue.label
          : '',
        selectedPropertyId: selectedMMSProductProperty
          ? selectedMMSProductProperty.propertyId
          : '',
      },
    })
    navigate(
      ROUTE_PRODUCT_PROPERTY_MAPPINGS.VALUE_MAPPING
        .replace(ROUTE_PARAMS.MARKETPLACE_TYPE_ID, marketplaceTypeIdParam || '')
        .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || '')
        .replace(
          ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID,
          productPropertyAttributeId || ''
        )
    )
  }

  const getBreadcrumbItems = (): BreadcrumbItems[] => {
    return [
      {
        label: t('product_property_mappings_page_title'),
        active: false,
        path: ROUTE_PRODUCT_PROPERTY_MAPPINGS.ROOT
          .replace(
            ROUTE_PARAMS.MARKETPLACE_TYPE_ID,
            marketplaceTypeIdParam || ''
          )
          .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || ''),
      },
      {
        label: `${selectedMarketplaceTypeNameState} / ${selectedMarketplaceProductPropertyState}`,
        active: true,
      },
    ]
  }

  useEffect(() => {
    if (productPropertyAttributeId && mmsProductPropertyOptions.length !== 0) {
      getProductPropertyAttribute(productPropertyAttributeId)
    }
  }, [productPropertyAttributeId, mmsProductPropertyOptions])

  useEffect(() => {
    getMMSProductPropertyOptions()
  }, [])

  useEffect(() => {
    if (selectedMMSProductProperty && countChangeMMSProductProperty > 0) {
      setFieldValue(
        'mmsValue',
        selectedMMSProductProperty.erpId ? selectedMMSProductProperty.erpId : ''
      )
    }
  }, [selectedMMSProductProperty])

  useCallbackPrompt(!isShouldPreventCancelEditForm && dirty)

  useCommonAccesibility()

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.productPropertyMappingEdit}
      ></SeoConfig>
      <BreadCrumb
        origin='productCategoryMapping'
        breadCrumbItems={getBreadcrumbItems()}
      />
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('product_property_mappings_edit_page_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <form
            className='form-layout'
            onSubmit={handleSubmit}
            autoComplete='on'
          >
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceValue'
                      className={classNames('required')}
                    >
                      {t(
                        'product_property_mapping_field_marketplace_product_property'
                      )}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceValue'
                      name='marketplaceValue'
                      className={classNames('react-select inherit-color')}
                      isDisabled={true}
                      value={selectedMarketplaceValue}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='mmsValue'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('mmsValue'),
                      })}
                    >
                      {t('product_property_mapping_field_mms_product_property')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='mmsValue'
                      name='mmsValue'
                      options={mmsProductPropertyOptions}
                      isSearchable
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('mmsValue'),
                      })}
                      value={selectedMMSProductProperty}
                      onChange={(item) => handleChangeMMSProductProperty(item)}
                      onBlur={(_e) => {
                        setFieldTouched('mmsValue')
                      }}
                    />
                  </Col>
                </Row>
                <Row className='align-items-center py-1'>
                  <Col xs={{span: 8, offset: 4}} className='py-0'>
                    <small className='p-error text-sm'>{errorMessage}</small>
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row>
              <Container fluid>
                <Row>
                  <Col>
                    <div className='d-flex justify-content-center'>
                      <Button
                        className='me-2'
                        onClick={handleNavigateBackToProductPropertyMappingList}
                        variant='danger'
                      >
                        {t('common_confirm_cancel')}
                      </Button>
                      {isEnumExistedInProductAttribute && (
                        <Button
                          className='me-2'
                          variant='info'
                          onClick={handleNavigateToValueMapping}
                          disabled={isShouldDisabledValueMappingButton}
                        >
                          {t('product_property_mapping_edit_enum_button_title')}
                        </Button>
                      )}
                      <Button
                        variant='success'
                        className='me-2'
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting}
                      >
                        {t('common_confirm_save')}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}
