import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {useFormik} from 'formik'
import Select from 'react-select'
import classNames from 'classnames'
import {useNavigate} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import {confirmDialog} from 'primereact/confirmdialog'
import {ISiteLocale} from '../../interface/organization'
import SiteLocaleService from '../../services/SiteLocaleService'
import {GlobalContext} from '../../store/GlobalContext'
import {isValidErpId} from '../../helpers/validateErpId'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  ERROR_FIELD_INVALID,
  extractDomainFromUrl,
  URL_REGEX,
} from '../../constants/common'
import DialogTemplate from '../../components/DialogTemplate'
import {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  PERMISSIONS,
  ROUTE_PARAMS,
  ROUTE_SITE_LOCALE,
} from '../../constants'
import {
  useCallbackPrompt,
  useSwitchAccesibility,
  useConditionForm,
  useHandleError,
} from '../../hooks'
import {ToastContext} from '../../providers'

const SITE_LOCALE_ERROR = {
  DUPLICATE_SITE_LOCALE_ERP_ID: 'DUPLICATE_SITE_LOCALE_ERP_ID',
  DUPLICATE_SITE_LOCALE_URL: 'DUPLICATE_SITE_LOCALE_URL',
}

interface ISiteLocaleFormProps {
  orgId?: string
  siteId: string
  siteLocaleId: string | undefined
  getSiteLocale: () => void
  defaultSiteLocale: ISiteLocale
  onSavedSuccess: (site: ISiteLocale) => void
}

type ISiteLocaleErrors = {
  [key in keyof ISiteLocale]?: string
}

const SiteLocaleForm = (props: ISiteLocaleFormProps) => {
  const {
    orgId,
    siteLocaleId,
    siteId,
    defaultSiteLocale,
    onSavedSuccess,
    getSiteLocale,
  } = props
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {toast} = useContext(ToastContext)
  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const [locales, setLocales] = useState<any[]>([])
  const [originalLocales, setOriginalLocales] = useState<any[]>([])
  const [selectedLocale, setSelectedLocale] = useState<any>(null)
  const [existsSiteLocaleUrl, setExistsSiteLocaleUrl] = useState(
    new Set<string>()
  )
  const [existsSiteLocaleErpId, setExistsSiteLocaleErpId] = useState(
    new Set<string>()
  )
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isShouldBackToLocaleList, setIsBackToLocaleList] = useState<boolean>(false)

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getSiteLocale(),
    })
  }

  const handleSiteLocaleError = (err: any) => {
    setSubmitting(false)
    if (
      err.response.status === CONFLICT_ERROR &&
      err.response.data.errorCode === ERROR_FIELD_INVALID
    ) {
      err.response.data.invalidFields.forEach((invalidField: any) => {
        switch (invalidField.errorMessage) {
          case SITE_LOCALE_ERROR.DUPLICATE_SITE_LOCALE_ERP_ID:
            existsSiteLocaleErpId.add(values.erpId)
            setExistsSiteLocaleErpId(new Set<string>(existsSiteLocaleErpId))
            break
          case SITE_LOCALE_ERROR.DUPLICATE_SITE_LOCALE_URL:
            existsSiteLocaleUrl.add(extractDomainFromUrl(values.url))
            setExistsSiteLocaleUrl(new Set<string>(existsSiteLocaleUrl))
            break
        }
      })
      validateForm()
    } else if (err.response.status !== BAD_REQUEST_ERROR) {
      handleErrorResponse(err)
    } else {
      concurrentHandling()
    }
  }

  const {
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldValue,
    setFieldTouched,
    values,
    dirty,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    validateForm,
  } = useFormik<ISiteLocale>({
    enableReinitialize: true,
    initialValues: defaultSiteLocale,
    onSubmit: (data: any) => {
      setSubmitting(true)
      if (siteLocaleId) {
        new SiteLocaleService(axiosClient)
          .editLocale({...data, siteId: siteId})
          .then((response: any) => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            onSavedSuccess(response.data)
            showLocaleSuccessEdited()
            setIsSaveButtonDisabled(true)
            getSiteLocale()
          })
          .catch(handleSiteLocaleError)
      } else {
        new SiteLocaleService(axiosClient)
          .addLocale({...data, siteId: siteId})
          .then((response: any) => {
            onSavedSuccess(response.data)
            setIsSubmitSuccess(true)
            showLocaleSuccessAdded()
            setIsBackToLocaleList(true)
          })
          .catch(handleSiteLocaleError)
      }
    },
    validate: (data: any) => {
      let validErrors: ISiteLocaleErrors = {}
      if (!data.erpId) {
        validErrors.erpId = t('form_validate_required')
      } else if (existsSiteLocaleErpId.has(data.erpId.trim())) {
        validErrors.erpId = t('form_validate_duplicated_erp_id')
      } else if (!isValidErpId(data.erpId)) {
        validErrors.erpId = t('form_validate_invalid_erp_id_pattern')
      }
      if (!data.localeId) {
        validErrors.localeId = t('form_validate_required')
      }
      if (!data.url) {
        validErrors.url = t('form_validate_required')
      } else if (!data.url.match(URL_REGEX)) {
        validErrors.url = t('form_validate_invalid_url')
      } else if (
        existsSiteLocaleUrl.has(extractDomainFromUrl(data.url.trim()))
      ) {
        validErrors.url = t('form_validate_duplicated_site_url')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof ISiteLocale) =>
    !!(touched[name] && errors[name])

  const getFormErrorMessage = (name: keyof ISiteLocale) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <div className='col-8 col-offset-4 py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </div>
      )
    )
  }

  const backToLocales = () => {
    orgId &&
      navigate(
        ROUTE_SITE_LOCALE.ROOT.replace(ROUTE_PARAMS.ORG_ID, orgId).replace(
          ROUTE_PARAMS.SITE_ID,
          siteId
        )
      )
  }

  const showLocaleSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_added_locale'),
      life: 5000,
    })
  }

  const showLocaleSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name')
    setValues({...values, [attribute]: event.target.value.trim()})
  }

  const onSelectChange = (selectedValue: any, fieldName: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    switch (fieldName) {
      case 'localeId':
        setSelectedLocale(selectedValue)
        setFieldValue('localeId', selectedValue.value)
        setFieldValue(
          'name',
          originalLocales.find((e) => e.id === selectedValue.value)?.name
        )
        break
    }
  }

  const formatInputSwitch = (event: any) => {
    if (event.target.value === true) {
      setValues({...values, status: 'ACTIVE'})
    } else {
      setValues({...values, status: 'INACTIVE'})
    }
  }

  const handleDropdownBlur = () => {
    setFieldTouched('localeId')
  }

  useEffect(() => {
    if (!siteLocaleId || (siteLocaleId && defaultSiteLocale.localeId)) {
      new SiteLocaleService(axiosClient)
        .getUnassignedLocales(siteId, defaultSiteLocale.localeId)
        .then((response: any) => {
          setLocales(
            response.data.map((item: any) => ({
              label: item.id,
              value: item.id,
            }))
          )
          setOriginalLocales(response.data)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [defaultSiteLocale])

  useEffect(() => {
    setSelectedLocale({
      label: defaultSiteLocale.localeId,
      value: defaultSiteLocale.localeId,
    })
  }, [defaultSiteLocale])

  useEffect(() => {
    isShouldBackToLocaleList && backToLocales()
  }, [isShouldBackToLocaleList])

  const {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onInputChange,
    onSwitchChange,
  } = useConditionForm(handleChange, formatInputSwitch)

  useCallbackPrompt(!isSubmitSuccess && dirty)

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={
          siteLocaleId
            ? seoProperty.siteLocalesEdit
            : seoProperty.siteLocalesAdd
        }
      ></SeoConfig>
      <Card className='card-form'>
        <Card.Header>
          <h4 className='card-form__title'>
            {siteLocaleId
              ? t('siteLocales_edit_title')
              : t('siteLocales_add_title')}
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
                {siteLocaleId ? (
                  <Row className='align-items-center pb-1'>
                    <Col xs={4}>
                      <label htmlFor='id' className=''>
                        Id
                      </label>
                    </Col>
                    <Col xs={8} className='p-fluid'>
                      <InputText
                        id='id'
                        name='id'
                        value={values.id}
                        disabled
                        className='p-inputtext-sm'
                      />
                    </Col>
                  </Row>
                ) : (
                  ''
                )}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='erpId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('erpId'),
                      })}
                    >
                      {t('siteLocales_form_erpId')}
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
                      className={classNames('w-full p-inputtext-sm', {
                        'p-invalid': isFormFieldValid('erpId'),
                      })}
                      maxLength={16}
                      disabled={!!siteLocaleId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}></Col>
                  <Col xs={8}>{getFormErrorMessage('erpId')}</Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='localeId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('localeId'),
                      })}
                    >
                      {t('siteLocales_form_locale')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='localeId'
                      name='localeId'
                      options={locales}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'localeId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('localeId'),
                      })}
                      value={selectedLocale}
                      onBlur={handleDropdownBlur}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}></Col>
                  <Col xs={8}>{getFormErrorMessage('localeId')}</Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='name'
                      className={classNames({
                        'p-error': isFormFieldValid('name'),
                      })}
                    >
                      {t('siteLocales_form_name')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='name'
                      name='name'
                      value={values.name}
                      className={classNames('w-full p-inputtext-sm', {
                        'p-invalid': isFormFieldValid('name'),
                      })}
                      maxLength={128}
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}></Col>
                  <Col xs={8}>{getFormErrorMessage('name')}</Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='url'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('url'),
                      })}
                    >
                      {t('siteLocales_form_url')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='url'
                      name='url'
                      value={values.url}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-inputtext-sm', {
                        'p-invalid': isFormFieldValid('url'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}></Col>
                  <Col xs={8}>{getFormErrorMessage('url')}</Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='status' className=''>
                      {t('organization_details_status_active')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE' ? true : false}
                      onChange={onSwitchChange}
                      disabled={!!siteLocaleId}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={backToLocales}
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
                        (Boolean(siteLocaleId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.view_organization_list,
                            PERMISSIONS.view_site_list,
                            PERMISSIONS.edit_locale,
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

export default SiteLocaleForm
