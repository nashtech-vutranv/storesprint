import classNames from 'classnames'
import {useFormik} from 'formik'
import Select from 'react-select'
import {confirmDialog} from 'primereact/confirmdialog'
import {InputSwitch} from 'primereact/inputswitch'
import {InputText} from 'primereact/inputtext'
import {useContext, useEffect, useState} from 'react'
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import DialogTemplate from '../../components/DialogTemplate'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  useCallbackPrompt,
  useCommonAccesibility,
  useConditionForm,
  usePersistLocationState,
  useSwitchAccesibility,
  useHandleError
} from '../../hooks'
import {IProducProperties} from '../../interface/productProperties'
import {ToastContext} from '../../providers'
import {BAD_REQUEST_ERROR, PERMISSIONS, ROUTE_PRODUCT_PROPERTIES} from '../../constants'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import {GlobalContext} from '../../store/GlobalContext'
import {isValidErpId} from '../../helpers/validateErpId'

const defaultProductProperty: IProducProperties = {
  id: '',
  erpId: '',
  name: '',
  version: 0,
  status: 'ACTIVE',
  type: '',
  localeSensitive: true,
  existedValues: false,
  createdAt: null,
  modifiedAt: null,
}

type IProducPropertiesErrors = {
  [key in keyof IProducProperties]?: string
}

export default function UpdateProductProperty() {
  const {productPropertyId} = useParams<{productPropertyId: string}>()
  const [types, setTypes] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<any>(null)
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const {toast} = useContext(ToastContext)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isShouldGoBackToProductPropertiesList, setIsShouldGoBackToProductPropertiesList] = useState<boolean>(false)

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  useEffect(() => {
    new ProductPropertiesService(axiosClient)
      .fetchProductPropertyTypes()
      .then((res: any) => {
        setTypes(res.data)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
    if (productPropertyId) {
      getProductProperty()
    }
  }, [])

  useEffect(() => {
    isShouldGoBackToProductPropertiesList && backToProductProperties()
  }, [isShouldGoBackToProductPropertiesList])

  const getProductProperty = () => {
    new ProductPropertiesService(axiosClient)
      .fetchProductPropertiesById(productPropertyId)
      .then((response: any) => {
        resetForm({values: response.data})
        setSelectedType({
          label: response.data.type,
          value: response.data.type,
        })
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getProductProperty(),
    })
  }

  const isFormFieldValid = (name: keyof IProducProperties) => {
    return !!(touched[name] && errors[name])
  }

  const backToProductProperties = () => {
    navigate(ROUTE_PRODUCT_PROPERTIES.ROOT)
  }

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name')
    setValues({...values, [attribute]: event.target.value.trim()})
  }

  const formatInputSwitch = (event: any) => {
    if (event.target.name === 'status') {
      setValues({
        ...values,
        status: Boolean(event.target.value) ? 'ACTIVE' : 'INACTIVE',
      })
    }

    if (event.target.name === 'localeSensitive') {
      setValues({
        ...values,
        localeSensitive: event.target.value,
      })
    }
  }

  const getFormErrorMessage = (name: keyof IProducProperties) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const showSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const handleError = (err: any) => {
    let shouldHandleConcurrent = false
    if (
      err.response.status === BAD_REQUEST_ERROR &&
      err.response.data.errorCode === 'DUPLICATE_ERP_ID'
    ) {
      setFieldError('erpId', t('form_validate_duplicated_erp_id'))
      return shouldHandleConcurrent
    } else if (
      err.response.status === BAD_REQUEST_ERROR &&
      err.response.data.errorCode === 'DUPLICATE_PROPERTY_NAME'
    ) {
      setFieldError('name', t('form_validate_duplicated_product_property_name'))
      return shouldHandleConcurrent
    } else if (err.response.status !== BAD_REQUEST_ERROR) {
      handleErrorResponse(err)
      return shouldHandleConcurrent
    }

    shouldHandleConcurrent = true
    return shouldHandleConcurrent
  }

  const {
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldError,
    setTouched,
    setFieldValue,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    resetForm,
  } = useFormik<IProducProperties>({
    initialValues: defaultProductProperty,
    onSubmit: (data: any) => {
      setSubmitting(true)
      if (productPropertyId) {
        new ProductPropertiesService(axiosClient)
          .editProductProperty(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showSuccessEdited()
            setIsShouldGoBackToProductPropertiesList(true)
            getProductProperty()
          })
          .catch((err: any) => {
            setSubmitting(false)
            const shouldHandleConcurrent = handleError(err)
            if (shouldHandleConcurrent) {
              concurrentHandling()
            }
          })
      } else {
        new ProductPropertiesService(axiosClient)
          .addProductProperty(data)
          .then(() => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_product_property'),
              life: 5000,
            })
            setIsShouldGoBackToProductPropertiesList(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleError(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: IProducPropertiesErrors = {}

      if (!data.erpId) {
        validErrors.erpId = t('form_validate_required')
      } else if (!isValidErpId(data.erpId)) {
        validErrors.erpId = t('form_validate_invalid_erp_id_pattern')
      }
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }
      if (!data.type) {
        validErrors.type = t('form_validate_required')
      }

      return validErrors
    },
  })

  const {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onInputChange,
    onSwitchChange,
  } = useConditionForm(handleChange, formatInputSwitch)

  const onSelectChange = (selectedValue: any, _fieldName: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    setSelectedType(selectedValue)
    setFieldValue('type', selectedValue.value)
  }

  const onBlurSelectionChange = (e: any, _fieldName: string) => {
    setTouched({
      ...touched,
      type: true,
    })
    handleBlur(e.nativeEvent)
  }

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  useCommonAccesibility()

  useSwitchAccesibility(values)

  useEffect(() => {
    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('aria-checked')
    })
  }, [document.querySelectorAll('.p-inputswitch')])

  return (
    <>
      <SeoConfig
        seoProperty={
          productPropertyId
            ? seoProperty.productPropertyEdit
            : seoProperty.productPropertyAdd
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {productPropertyId
              ? t('product_properties_edit_title')
              : t('product_properties_add_title')}
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
                {productPropertyId && (
                  <Row className='align-items-center py-1'>
                    <Col xs={4}>
                      <label htmlFor='id'>Id</label>
                    </Col>
                    <Col xs={8} className='p-fluid'>
                      <InputText
                        id='id'
                        name='id'
                        value={values.id}
                        disabled
                        className='p-1'
                      />
                    </Col>
                  </Row>
                )}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='erpId'
                      className={classNames(
                        productPropertyId ? '' : 'required',
                        {
                          'p-error': isFormFieldValid('erpId'),
                        }
                      )}
                    >
                      {t('product_property_details_erp_id')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='erpId'
                      name='erpId'
                      value={values.erpId}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('erpId'),
                      })}
                      maxLength={64}
                      disabled={!!productPropertyId}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('erpId')}</Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='name'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('name'),
                      })}
                    >
                      {t('product_property_details_name')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='name'
                      name='name'
                      value={values.name}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('name'),
                      })}
                      maxLength={128}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('name')}</Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='type'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('type'),
                      })}
                    >
                      {t('product_property_details_type')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='type'
                      name='type'
                      options={types}
                      placeholder={t('marketplace_placeholder_type')}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'type')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('type'),
                      })}
                      value={selectedType}
                      onBlur={(e) => onBlurSelectionChange(e, 'type')}
                      classNamePrefix='react-select'
                      isDisabled={!!values.existedValues}
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('type')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='localeSensitive' className=''>
                      {t('product_property_details_locale_sensitive')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='localeSensitive'
                      checked={values.localeSensitive === true}
                      onChange={onSwitchChange}
                      disabled={!!values.existedValues}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('product_property_details_locale_active')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE'}
                      onChange={onSwitchChange}
                      disabled={Boolean(productPropertyId)}
                    />
                  </Col>
                </Row>

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
                        (Boolean(productPropertyId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.edit_product_property,
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
