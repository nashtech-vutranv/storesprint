import classNames from 'classnames'
import {useFormik} from 'formik'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {confirmDialog} from 'primereact/confirmdialog'
import {useContext, useEffect, useState} from 'react'
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import DialogTemplate from '../../components/DialogTemplate'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {transformToSelectData} from '../../helpers'
import {
  ICreateUpdateDeliveryTypeMapping,
  IDeliveryType,
  IMarketplaceDeliveryService,
  ISelectOption,
} from '../../interface'
import {ToastContext} from '../../providers'
import DeliveryService from '../../services/DeliveryService'
import {GlobalContext} from '../../store/GlobalContext'
import {
  useCallbackPrompt,
  useCommonAccesibility,
  useConditionForm,
  usePersistLocationState,
  useHandleError
} from '../../hooks'
import MappingService from '../../services/MappingService'
import {BAD_REQUEST_ERROR, PERMISSIONS} from '../../constants'

const defaultDeliveryTypeMapping: ICreateUpdateDeliveryTypeMapping = {
  version: 0,
  marketplaceTypeId: '',
  mmsValue: '',
  marketplaceValue: '',
}

type ICreateUpdateDeliveryTypeMappingErrors = {
  [key in keyof ICreateUpdateDeliveryTypeMapping]?: string
}

export default function UpdateDeliveryTypeMappings() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const {deliveryTypeMappingId} = useParams<{deliveryTypeMappingId: string}>()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<ISelectOption | null>(null)
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(null)
  const [
    selectedMarketplaceDeliveryService,
    setSelectedMarketplaceDeliveryService,
  ] = useState<ISelectOption | null>(null)
  const [deliveryTypeOptions, setDeliveryTypeOptions] = useState<
    ISelectOption[]
  >([])
  const [marketplaceTypeOptions, setMarketplaceTypeOptions] = useState<
    ISelectOption[]
  >([])
  const [
    marketplaceDeliveryServiceOptions,
    setMarketplaceDeliveryServiceOptions,
  ] = useState<ISelectOption[]>([])
  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const onBackToList = () => {
    navigate(-1)
  }

  const showDefaultPropertyValueSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const isFormFieldValid = (name: keyof ICreateUpdateDeliveryTypeMapping) => {
    return !!(touched[name] && errors[name])
  }

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getMarketplaceMapping(),
    })
  }

  const onSelectChange = (selectedValue: any, fieldName: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    setErrorMessage(null)
    switch (fieldName) {
      case 'mmsValue':
        setFieldValue('mmsValue', selectedValue.value)
        setSelectedDeliveryType(selectedValue)
        break
      case 'marketplaceTypeId':
        setFieldValue('marketplaceTypeId', selectedValue.value)
        setSelectedMarketplaceType(selectedValue)
        setMarketplaceDeliveryServiceOptions([])
        setSelectedMarketplaceDeliveryService(null)
        setFieldValue('marketplaceValue', '')
        break
      case 'marketplaceValue':
        setFieldValue('marketplaceValue', selectedValue.value)
        setSelectedMarketplaceDeliveryService(selectedValue)
        break
    }
  }

  const getDeliveryType = () => {
    new DeliveryService(axiosClient).getDeliveryTypes().then((response) => {
      setDeliveryTypeOptions(
        response.data.map((x: IDeliveryType) => ({
          label: x.deliveryTypeName,
          value: x.deliveryTypeName,
        }))
      )
    })
  }

  const getMarketplaceType = () => {
    new MappingService(axiosClient)
      .getAllMappingMarketplaces()
      .then((response) => {
        const options = transformToSelectData(response.data)
        setMarketplaceTypeOptions(options)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getMarketplaceDeliveryService = () => {
    new DeliveryService(axiosClient)
      .getMarketplaceDeliveryService(selectedMarketplaceType?.value || '')
      .then((response) => {
        setMarketplaceDeliveryServiceOptions(
          response.data.map((x: IMarketplaceDeliveryService) => ({
            label: x.marketplaceValue,
            value: x.marketplaceValue,
          }))
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getMarketplaceMapping = async () => {
    try {
      const response = await new MappingService(
        axiosClient
      ).getMarketplaceMapping(`${deliveryTypeMappingId}`)
      const {marketplaceType, marketplaceValue, mmsValue} = response.data
      setSelectedDeliveryType({
        label: mmsValue,
        value: mmsValue,
      })

      setSelectedMarketplaceType({
        label: marketplaceType.name,
        value: marketplaceType.id,
      })

      setSelectedMarketplaceDeliveryService({
        label: marketplaceValue,
        value: marketplaceValue,
      })

      resetForm({
        values: {
          ...values,
          mmsValue: response.data.mmsValue,
          marketplaceTypeId: response.data.marketplaceTypeId,
          marketplaceValue: response.data.marketplaceValue,
          version: response.data.version,
        },
      })
    } catch (error: any) {
      handleErrorResponse(error)
    }
  }

  const handleDuplicateError = (_err: any) => {
    setFieldError(
      'marketplaceValue',
      t(
        'delivery_type_mapping_duplicate_delivery_type_marketplace_mapping_error'
      )
    )
    setErrorMessage(
      t(
        'delivery_type_mapping_duplicate_delivery_type_marketplace_mapping_error'
      )
    )
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    dirty,
    resetForm,
  } = useFormik<ICreateUpdateDeliveryTypeMapping>({
    initialValues: defaultDeliveryTypeMapping,
    onSubmit: (data: ICreateUpdateDeliveryTypeMapping) => {
      setSubmitting(true)
      if (deliveryTypeMappingId) {
        new DeliveryService(axiosClient)
          .updateDeliveryTypeMapping(data, deliveryTypeMappingId)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showDefaultPropertyValueSuccessEdited()
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (
              err.response.status === BAD_REQUEST_ERROR &&
              err.response.data.errorCode ===
                'DUPLICATE_DELIVERY_TYPE_MARKETPLACE_MAPPING'
            ) {
              handleDuplicateError(err)
            } else if (err.response.status === BAD_REQUEST_ERROR) {
              concurrentHandling()
            } else {
              handleErrorResponse(err)
            }
          })
      } else {
        new DeliveryService(axiosClient)
          .createDeliveryTypeMapping(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_delivery_type_mapping'),
              life: 5000,
            })
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (
              err.response.data.status === BAD_REQUEST_ERROR &&
              err.response.data.errorCode ===
                'DUPLICATE_DELIVERY_TYPE_MARKETPLACE_MAPPING'
            ) {
              handleDuplicateError(err)
              return
            }
            handleErrorResponse(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: ICreateUpdateDeliveryTypeMappingErrors = {}
      if (!data.mmsValue) {
        validErrors.mmsValue = t('form_validate_required')
      }

      if (!data.marketplaceTypeId) {
        validErrors.marketplaceTypeId = t('form_validate_required')
      }

      if (!data.marketplaceValue) {
        validErrors.marketplaceValue = t('form_validate_required')
      }

      return validErrors
    },
  })

  const {isSaveButtonDisabled, setIsSaveButtonDisabled} =
    useConditionForm(handleChange)

  useCommonAccesibility()

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  if (isSubmitSuccess) {
    onBackToList()
  }

  useEffect(() => {
    getDeliveryType()
    getMarketplaceType()
    if (deliveryTypeMappingId) {
      getMarketplaceMapping()
    }
  }, [])

  useEffect(() => {
    if (selectedMarketplaceType) {
      getMarketplaceDeliveryService()
    }
  }, [selectedMarketplaceType])

  return (
    <>
      <SeoConfig
        seoProperty={
          deliveryTypeMappingId
            ? seoProperty.deliveryTypeMappingEdit
            : seoProperty.deliveryTypeMappingAdd
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {deliveryTypeMappingId
              ? t('delivery_type_mapping_edit_title')
              : t('delivery_type_mapping_add_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <form
              className='form-layout'
              onSubmit={handleSubmit}
              autoComplete='on'
            >
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='mmsValue'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('mmsValue'),
                      })}
                    >
                      {t('delivery_type_mapping_value_field_delivery_type')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      onChange={(op) => onSelectChange(op, 'mmsValue')}
                      onBlur={(_e) => {
                        setFieldTouched('mmsValue')
                      }}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('mmsValue'),
                      })}
                      placeholder={t(
                        'delivery_type_mapping_value_field_delivery_type_placeholder'
                      )}
                      options={deliveryTypeOptions}
                      isSearchable
                      isClearable
                      value={selectedDeliveryType}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceTypeId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('marketplaceTypeId'),
                      })}
                    >
                      {t('delivery_type_mapping_value_field_marketplace_type')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceTypeId'
                      name='marketplaceTypeId'
                      options={marketplaceTypeOptions}
                      placeholder={t(
                        'delivery_type_mapping_value_field_marketplace_type_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'marketplaceTypeId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceTypeId'),
                      })}
                      value={selectedMarketplaceType}
                      onBlur={(_e) => {
                        setFieldTouched('marketplaceTypeId')
                      }}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceValue'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('marketplaceValue'),
                      })}
                    >
                      {t(
                        'delivery_type_mapping_value_field_marketplace_delivery_service'
                      )}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <CreatableSelect
                      id='marketplaceValue'
                      name='marketplaceValue'
                      options={marketplaceDeliveryServiceOptions}
                      placeholder={t(
                        'delivery_type_mapping_value_field_marketplace_delivery_service_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'marketplaceValue')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceValue'),
                      })}
                      value={selectedMarketplaceDeliveryService}
                      onBlur={(_e) => {
                        setFieldTouched('marketplaceValue')
                      }}
                      classNamePrefix='react-select'
                      isDisabled={!selectedMarketplaceType}
                    />
                  </Col>
                </Row>

                {errorMessage && (
                  <Row>
                    <Col xs={{span: 8, offset: 4}} className='py-0'>
                      <small className='p-error text-sm'>{errorMessage}</small>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={() => navigate(-1)}
                      variant='danger'
                    >
                      {t('common_confirm_cancel')}
                    </Button>
                    <Button
                      variant='success'
                      className='me-2'
                      onClick={() => handleSubmit()}
                      disabled={
                        isSubmitting ||
                        isSaveButtonDisabled ||
                        (Boolean(deliveryTypeMappingId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.edit_delivery_mapping,
                          ]))
                      }
                    >
                      {t('common_confirm_save')}
                    </Button>
                  </Col>
                </Row>
              </Container>
            </form>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
