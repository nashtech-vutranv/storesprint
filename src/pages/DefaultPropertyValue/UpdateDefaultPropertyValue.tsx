import classNames from 'classnames'
import {useFormik} from 'formik'
import {AxiosResponse} from 'axios'
import {confirmDialog} from 'primereact/confirmdialog'
import {InputSwitch} from 'primereact/inputswitch'
import {useContext, useEffect, useState} from 'react'
import Select from 'react-select'
import {omit} from 'lodash'
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams, useLocation} from 'react-router-dom'
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
import {
  ICreateUpdateDefaultPropertyValue,
  IDefaultPropertyValue,
  IDefaultProperty,
} from '../../interface/defaultPropertyValue'
import {ToastContext} from '../../providers'
import DefaultPropertyValueService from '../../services/DefaultPropertyValueService'
import {GlobalContext} from '../../store/GlobalContext'
import OrganizationServices from '../../services/OrganizationService'
import {defaultAllDatasByErpIdPagination} from '../../constants/pagination'
import {transformToSelectData} from '../../helpers/select'
import SiteLocaleService from '../../services/SiteLocaleService'
import {ISelectOption} from '../../interface/selectOption'
import {PropertyInputControl} from '../../components'
import {BAD_REQUEST_ERROR, PERMISSIONS} from '../../constants'

const defaultPropertyValue: ICreateUpdateDefaultPropertyValue = {
  id: '',
  version: 0,
  status: 'ACTIVE',
  defaultValue: '',
  localeId: '',
  organizationId: '',
  propertyId: '',
}

const DEFAULT_VALUE_ALREADY_EXIST_ERROR = 'Default Property Value is duplicated'

type ICreateUpdateDefaultPropertyValueErrors = {
  [key in keyof ICreateUpdateDefaultPropertyValue]?: string
}

export default function UpdateDefaultPropertyValue() {
  const {t} = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)

  const {defaultPropertyValueId} = useParams<{defaultPropertyValueId: string}>()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const {toast} = useContext(ToastContext)
  const {handleErrorResponse} = useHandleError()
  const [selectOrganizationOptions, setSelectOrganizationOptions] = useState<
    ISelectOption[]
  >([])
  const [selectPropertyOptions, setSelectPropertyOptions] = useState<
    ISelectOption[]
  >([])
  const [originalProperties, setOriginalProperties] = useState<
    IDefaultProperty[]
  >([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<
    ISelectOption[]
  >([])
  const [selectedOrganization, setSelectedOrganization] =
    useState<ISelectOption | null>(null)
  const [selectedProperty, setSelectedProperty] =
    useState<ISelectOption | null>(null)
  const [selectedLocale, setSelectedLocale] = useState<ISelectOption | null>(
    null
  )
  const [isLocaleSensitive, setIsLocaleSensitive] = useState<boolean>(true)
  const [dataType, setDataType] = useState<string>('')
  const [defaultValue, setDefaultValue] = useState<string>('')
  const [isShouldNavigateBackToListPage, setIsShouldNavigateBackToListPage] = useState<boolean>(false)

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  useEffect(() => {
    getOrganizations()
    getProperties()
    getLocales()
    if (defaultPropertyValueId) {
      getDefaultPropertyValue()
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('input[type="text"]').forEach((el) => {
      el.setAttribute('aria-label', 'input-text')
    })
  }, [document.querySelectorAll('input[type="text"]')])

  useEffect(() => {
    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('aria-checked')
    })
  }, [])

  useEffect(() => {
    document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      el.removeAttribute('aria-checked')
    })
  }, [document.querySelectorAll('input[type="checkbox"]')])

  useEffect(() => {
    if (selectedProperty && originalProperties.length !== 0) {
      const selectedItem = originalProperties.find(
        (x: IDefaultProperty) => x.id === selectedProperty.value
      )
      if (selectedItem) {
        setIsLocaleSensitive(selectedItem.localeSensitive)
        setDataType(selectedItem.type)
      }
    }
  }, [selectedProperty, originalProperties])

  useEffect(() => {
    if (!Boolean(defaultPropertyValueId) && !isLocaleSensitive) {
      setSelectedLocale(null)
      setFieldValue('localeId', '')
    }
  }, [isLocaleSensitive])

  useEffect(() => {
    document.querySelectorAll('input[name="defaultValue"]').forEach((el) => {
      el.setAttribute('aria-label', 'defaultValue')
    })
  }, [document.querySelectorAll('input[name="defaultValue"]')])

  const getOrganizations = () => {
    new OrganizationServices(axiosClient)
      .getAllOrganizations({
        ...omit(defaultAllDatasByErpIdPagination, [
          'first',
          'keyword',
          'sortField',
          'sortOrder',
        ]),
        isReviewProduct: false,
      })
      .then((response: any) => {
        setSelectOrganizationOptions(
          transformToSelectData(response.data.content)
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getProperties = () => {
    new DefaultPropertyValueService(axiosClient)
      .filterProperties(
        {
          ...defaultAllDatasByErpIdPagination,
        },
        {search: ''}
      )
      .then((response: any) => {
        setOriginalProperties(response.data.content)
        setSelectPropertyOptions(transformToSelectData(response.data.content))
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getLocales = () => {
    new SiteLocaleService(axiosClient)
      .getLocalesList()
      .then((response: any) => {
        const options = response.data.map((x: any) => ({
          value: x.id,
          label: x.name,
        }))
        options.unshift({
          value: '',
          label: 'All locales',
        })
        setSelectLocaleOptions(options)
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
      accept: () => getDefaultPropertyValue(),
    })
  }

  const formatInputSwitch = (event: any) => {
    setValues({
      ...values,
      status: Boolean(event.target.value) ? 'ACTIVE' : 'INACTIVE',
    })
  }

  const showDefaultPropertyValueSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const isFormFieldValid = (
    name: keyof ICreateUpdateDefaultPropertyValueErrors
  ) => {
    return !!(touched[name] && errors[name])
  }

  const getFormErrorMessage = (
    name: keyof ICreateUpdateDefaultPropertyValueErrors
  ) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const getDefaultPropertyValue = () => {
    new DefaultPropertyValueService(axiosClient)
      .fetchDefaultPropertyValueById(defaultPropertyValueId)
      .then((response: AxiosResponse<IDefaultPropertyValue>) => {
        const data = response.data
        resetForm({
          values: {
            defaultValue: data.defaultValue,
            id: data.id,
            localeId: data.localeId,
            organizationId: data.organizationId,
            propertyId: data.propertyId,
            status: data.status,
            version: data.version,
          },
        })
        setDefaultValue(data.defaultValue)
        setSelectedOrganization({
          label: data.organizationName,
          value: data.organizationId,
        })

        setSelectedProperty({
          label: data.propertyName,
          value: data.propertyId,
        })

        setSelectedLocale({
          label: data.localeName ?? 'All locales',
          value: data.localeId ?? '',
        })
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const onSelectChange = (selectedValue: any, fieldName: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    switch (fieldName) {
      case 'organizationId':
        setFieldValue('organizationId', selectedValue.value)
        setSelectedOrganization(selectedValue)
        break
      case 'propertyId':
        setFieldValue('propertyId', selectedValue.value)
        setSelectedProperty(selectedValue)
        if (!defaultPropertyValueId && isLocaleSensitive) {
          setSelectedLocale(selectLocaleOptions[0])
        }
        break
      case 'localeId':
        setFieldValue('localeId', selectedValue.value)
        setSelectedLocale(selectedValue)
        break
    }
  }

  const onBlurSelectionChange = (e: any, fieldName: string) => {
    switch (fieldName) {
      case 'organizationId':
        setTouched({
          ...touched,
          organizationId: true,
        })
        break
      case 'propertyId':
        setTouched({
          ...touched,
          propertyId: true,
        })
        break
      case 'localeId':
        setTouched({
          ...touched,
          localeId: true,
        })
        break
    }

    handleBlur(e.nativeEvent)
  }

  const setFormDefaultValue = (controlName: string, value: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    setFieldValue(controlName, value)
  }

  const onPropertyInputControlChange = (
    controlName: string,
    _type: string,
    value: string
  ) => {
    setFormDefaultValue(controlName, value)
  }

  const onPropertyInputControlBlur = (
    controlName: string,
    _type: string,
    value: string
  ) => {
    setTouched({...touched, [controlName]: true})
    setFormDefaultValue(controlName, value)
  }

  const onBackToList = () => {
    navigate(-1)
  }

  const handleErrorStatus400 = (err: any) => {
    if (err.response.data.errorCode === 'INVALID_DEFAULT_VALUE') {
      setFieldError(
        'defaultValue',
        t('default_property_value_invalid_value_error_message')
      )
      return
    }

    if (err.response.data.message === DEFAULT_VALUE_ALREADY_EXIST_ERROR) {
      setFieldError(
        'defaultValue',
        t('default_property_value_aldready_exist_error_message')
      )
      return
    }
  }

  const detectSelectLocale = () => (
    isLocaleSensitive || defaultPropertyValueId) ? selectedLocale : selectLocaleOptions[0]

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
  } = useFormik<ICreateUpdateDefaultPropertyValue>({
    initialValues: defaultPropertyValue,
    onSubmit: (data: ICreateUpdateDefaultPropertyValue) => {
      setSubmitting(true)

      if (defaultPropertyValueId) {
        new DefaultPropertyValueService(axiosClient)
          .editDefaultPropertyValue(defaultPropertyValueId, data.defaultValue)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showDefaultPropertyValueSuccessEdited()
            setIsShouldNavigateBackToListPage(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === BAD_REQUEST_ERROR) {
              handleErrorStatus400(err)
            }
            if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            } else {
              concurrentHandling()
            }
          })
      } else {
        new DefaultPropertyValueService(axiosClient)
          .addDefaultPropertyValue(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_default_property_value'),
              life: 5000,
            })
            setIsShouldNavigateBackToListPage(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === BAD_REQUEST_ERROR) {
              handleErrorStatus400(err)
            }
            if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            }
          })
      }
    },
    validate: (data: any) => {
      let validErrors: ICreateUpdateDefaultPropertyValueErrors = {}
      if (!data.organizationId) {
        validErrors.organizationId = t('form_validate_required')
      }

      if (!data.propertyId) {
        validErrors.propertyId = t('form_validate_required')
      }

      if (
        !data.defaultValue &&
        ['', 'String', 'Long string', 'Number'].includes(dataType)
      ) {
        validErrors.defaultValue = t('form_validate_required')
      }

      if (
        data.propertyId &&
        data.defaultValue &&
        dataType === 'Number' &&
        (Number.isNaN(Number(data.defaultValue)) ||
          Number(data.defaultValue) < 0)
      ) {
        validErrors.defaultValue = t(
          'default_property_value_invalid_value_error_message'
        )
      }

      return validErrors
    },
  })

  const {isSaveButtonDisabled, setIsSaveButtonDisabled, onSwitchChange} =
    useConditionForm(handleChange, formatInputSwitch)

  useCommonAccesibility()

  useEffect(() => {
    document.querySelectorAll('div[role=checkbox]').forEach((el) => {
      el.removeAttribute('role')
      el.removeAttribute('aria-checked')
    })
  }, [document.querySelectorAll('div[role=checkbox]')])

  useEffect(() => {
    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('aria-checked')
    })
  }, [document.querySelectorAll('.p-inputswitch')])

  useEffect(() => {
    isShouldNavigateBackToListPage && navigate(-1)
  }, [isShouldNavigateBackToListPage])

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={
          defaultPropertyValueId
            ? seoProperty.editDefaultPropertyValue
            : seoProperty.addDefaultPropertyValue
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {defaultPropertyValueId
              ? t('default_property_value_edit_title')
              : t('default_property_value_add_title')}
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
                      htmlFor='organizationId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('organizationId'),
                      })}
                    >
                      {t('default_property_value_field_organization')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='organizationId'
                      name='organizationId'
                      options={selectOrganizationOptions}
                      placeholder={t(
                        'default_property_value_field_organization_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'organizationId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('organizationId'),
                      })}
                      value={selectedOrganization}
                      onBlur={(e) => onBlurSelectionChange(e, 'organizationId')}
                      classNamePrefix='react-select'
                      isDisabled={Boolean(defaultPropertyValueId)}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='propertyId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('propertyId'),
                      })}
                    >
                      {t('default_property_value_field_property')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='propertyId'
                      name='propertyId'
                      options={selectPropertyOptions}
                      placeholder={t(
                        'default_property_value_field_property_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'propertyId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('propertyId'),
                      })}
                      value={selectedProperty}
                      onBlur={(e) => onBlurSelectionChange(e, 'propertyId')}
                      classNamePrefix='react-select'
                      isDisabled={Boolean(defaultPropertyValueId)}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='localeId'
                      className={classNames({
                        'p-error': isFormFieldValid('localeId'),
                      })}
                    >
                      {t('default_property_value_field_locale')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='localeId'
                      name='localeId'
                      options={selectLocaleOptions}
                      placeholder={t(
                        'default_property_value_field_locale_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'localeId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('localeId'),
                      })}
                      value={detectSelectLocale()}
                      onBlur={(e) => onBlurSelectionChange(e, 'localeId')}
                      classNamePrefix='react-select'
                      isDisabled={
                        !isLocaleSensitive || Boolean(defaultPropertyValueId)
                      }
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='defaultValue'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('defaultValue'),
                      })}
                    >
                      {t('default_property_value_field_default_value')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    {dataType !== '' && (
                      <PropertyInputControl
                        type={dataType}
                        controlName='defaultValue'
                        classes={classNames({
                          'p-invalid': isFormFieldValid('defaultValue'),
                        })}
                        onChange={onPropertyInputControlChange}
                        onBlur={onPropertyInputControlBlur}
                        defaultValue={defaultValue}
                      />
                    )}
                  </Col>
                </Row>
                {getFormErrorMessage('defaultValue')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='status'>
                      {t('default_property_value_field_default_status')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE'}
                      onChange={onSwitchChange}
                      disabled={Boolean(defaultPropertyValueId)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={onBackToList}
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
                        (Boolean(defaultPropertyValueId) && checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.edit_default_property_value,
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
