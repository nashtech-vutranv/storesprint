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
} from '../../helpers'
import {
  IUpdateProductCategoryMapping,
  ISelectOption,
  IUpdateProductPropertyMapping,
} from '../../interface'
import {ToastContext} from '../../providers'
import {ROUTE_PRODUCT_PROPERTY_MAPPINGS, ROUTE_PARAMS} from '../../constants'
import BreadCrumb from '../../components/BreadCrumb'

export default function AddProductPropertyMapping() {
  const {t} = useTranslation()

  const {
    productCategoryMappingsId,
    marketplaceTypeId: marketplaceTypeIdParam,
    mappingTargetId,
  } = useParams()

  const location = useLocation() as any
  const {state: persistState} = usePersistLocationState(location)

  const {
    state: {
      axiosClient,
      pagesInfo: {
        productPropertyMappings: {
          searchData: {
            selectedMarketplaceProductProperty: marketplaceProductProperty,
            selectedMarketplaceCode: marketplaceCode,
            selectedMarketplaceTypeId: marketplaceTypeId,
          },
        },
      },
    },
    dispatch: {pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const navigate = useNavigate()

  const [selecteMarketplaceValue, setSelectedMarketplaceValue] = useState<ISelectOption | null>(null)
  const [selectedMMSProductProperty, setSelectedMMSProductProperty] = useState<
  ISelectOption & {erpId: string} | null
  >(null)
  const [mmsProductPropertyOptions, setMMSProductPropertyOptions] =
    useState<Array<ISelectOption & {erpId: string}>>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isShouldPreventCancelEditForm, setIsShouldPreventCancelEditForm] = useState<boolean>(false)
  const [isShouldNavigateBackToListPage, setIsShouldNavigateBackToListPage] = useState<boolean>(false)
  const [countChangeMMSProductProperty, setCountChangeMMSProductProperty] = useState<number>(0)

  const initialValueFormRef = useRef<IUpdateProductPropertyMapping>({
    version: 0,
    marketplaceTypeId: '',
    mmsValue: '',
    marketplaceValue: '',
    marketplaceCode: null,
  })

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

  const showProductPropertyMappingSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('product_property_mapping_add_success_message'),
      life: 5000,
    })
  }

  const handleAddProductPropertyMappingError = (_err: any) => {
    setErrorMessage(t('product_property_mapping_duplicate_error_message'))
  }

  const handleChangeMMSProductProperty = (_selectedProductProperty: ISelectOption & {erpId: string} | null) => {
    setErrorMessage(null)
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
    resetForm,
    values,
  } = useFormik<IUpdateProductPropertyMapping>({
    initialValues: initialValueFormRef.current,
    onSubmit: (requestData) => {
      setSubmitting(true)
      setIsShouldPreventCancelEditForm(true)
      new ProductPropertyMappingsService(axiosClient)
        .addProductPropertyMapping(requestData)
        .then((_response) => {
          setSubmitting(false)
          showProductPropertyMappingSuccessAdded()
          setIsShouldNavigateBackToListPage(true)
          setIsShouldPreventCancelEditForm(false)
        })
        .catch((err) => {
          setSubmitting(false)
          setIsShouldPreventCancelEditForm(false)
          handleErrorResponse(err, handleAddProductPropertyMappingError)
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
      ROUTE_PRODUCT_PROPERTY_MAPPINGS.ROOT.replace(
        ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID,
        productCategoryMappingsId || ''
      )
        .replace(ROUTE_PARAMS.MARKETPLACE_TYPE_ID, marketplaceTypeIdParam || '')
        .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || ''),
      {
        state: persistState,
      }
    )
  }

  useEffect(() => {
    getMMSProductPropertyOptions()
  }, [])

  useEffect(() => {
    marketplaceProductProperty && setSelectedMarketplaceValue({
      label: marketplaceProductProperty,
      value: marketplaceProductProperty,
    })
  }, [marketplaceProductProperty])

  useEffect(() => {
    if (selectedMMSProductProperty) {
      countChangeMMSProductProperty > 0 && setFieldValue(
        'mmsValue',
        selectedMMSProductProperty.erpId ? selectedMMSProductProperty.erpId : ''
      )
      countChangeMMSProductProperty === 0 &&
        resetForm({
          values: {
            ...values,
            mmsValue: selectedMMSProductProperty.erpId
              ? selectedMMSProductProperty.erpId
              : '',
          },
        })
    }
  }, [selectedMMSProductProperty])

  useEffect(() => {
    resetForm({
      values: {
        ...values,
        marketplaceValue: marketplaceProductProperty || '',
        marketplaceTypeId: marketplaceTypeId || '',
        marketplaceCode: marketplaceCode || null
      },
    })
  }, [marketplaceProductProperty, marketplaceCode, marketplaceTypeId])

  useEffect(() => {
    if (isShouldNavigateBackToListPage) {
      handleNavigateBackToProductPropertyMappingList()
    } 
  }, [isShouldNavigateBackToListPage])

  useEffect(() => {
    if (location.state) {
      const {
        marketplaceValue: marketplaceValueState,
        marketplaceTypeId: marketplaceTypeIdState,
        marketplaceCode: marketplaceCodeState,
      } = location.state
      pagesInfoDispatch({
        type: PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PUSH_DATA,
        payload: {
          selectedMarketplaceProductProperty: marketplaceValueState,
          selectedMarketplaceCode: marketplaceCodeState,
          selectedMarketplaceTypeId: marketplaceTypeIdState,
        },
      })
    }
  }, [location])

  useCallbackPrompt(!isShouldPreventCancelEditForm && (values.mmsValue !== initialValueFormRef.current.mmsValue))

  useCommonAccesibility()

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.productPropertyMappingAdd}
      ></SeoConfig>
      <BreadCrumb
        origin='productCategoryMapping'
        breadCrumbItems={[
          {label: t('product_property_mappings_page_title'), active: true},
        ]}
      />
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('product_property_mappings_add_page_title')}
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
                      value={selecteMarketplaceValue}
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
