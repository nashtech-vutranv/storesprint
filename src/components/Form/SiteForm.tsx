import {Row, Col, Button, Card, Container} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useNavigate} from 'react-router-dom'
import {useEffect, useContext, useState} from 'react'
import {confirmDialog} from 'primereact/confirmdialog'
import {ISite} from '../../interface/organization'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import SitesService from '../../services/SitesService'
import {isValidErpId} from '../../helpers/validateErpId'
import {GlobalContext} from '../../store/GlobalContext'
import {SiteActionType} from '../../store/actions'
import {
  ERROR_FIELD_INVALID,
  URL_REGEX,
  extractDomainFromUrl,
} from '../../constants/common'
import DialogTemplate from '../../components/DialogTemplate'
import {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  PERMISSIONS,
  ROUTE_PARAMS,
  ROUTE_SITE,
  ROUTE_SITE_LOCALE,
} from '../../constants'
import {
  useCallbackPrompt,
  useSwitchAccesibility,
  useConditionForm,
  useHandleError,
} from '../../hooks'
import {ToastContext} from '../../providers/'

interface ISiteFormProps {
  orgId: string
  siteId: string | undefined
  getSite: () => void
  defaultSite: ISite
  onSavedSuccess: (site: ISite) => void
}

const SITE_ERROR = {
  DUPLICATE_SITE_ERP_ID: 'DUPLICATE_SITE_ERP_ID',
  DUPLICATE_SITE_URL: 'DUPLICATE_SITE_URL',
}

type ISiteErrors = {
  [key in keyof ISite]?: string
}

const SiteForm = (props: ISiteFormProps) => {
  const {siteId, orgId, defaultSite, onSavedSuccess, getSite} = props

  const {toast} = useContext(ToastContext)
  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
      site
    },
    dispatch: {
      site: siteDispatch
    }
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const navigate = useNavigate()

  const {t} = useTranslation()

  const [existsSiteUrl, setExistsSiteUrl] = useState(new Set<string>())
  const [existsSiteErpId, setExistsSiteErpId] = useState(new Set<string>())
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isShouldGoBackToSiteList, setIsGoBackToSiteList] = useState<boolean>(false)

  const showSiteSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const showSiteSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_added_site'),
      life: 5000,
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
      accept: () => getSite(),
    })
  }

  const handleSiteError = (err: any) => {
    setSubmitting(false)
    if (
      err.response.status === CONFLICT_ERROR &&
      err.response.data.errorCode === ERROR_FIELD_INVALID
    ) {
      err.response.data.invalidFields.forEach((invalidField: any) => {
        switch (invalidField.errorMessage) {
          case SITE_ERROR.DUPLICATE_SITE_ERP_ID:
            existsSiteErpId.add(values.erpId)
            setExistsSiteErpId(new Set<string>(existsSiteErpId))
            break
          case SITE_ERROR.DUPLICATE_SITE_URL:
            existsSiteUrl.add(extractDomainFromUrl(values.url))
            setExistsSiteUrl(new Set<string>(existsSiteUrl))
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
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    validateForm,
  } = useFormik<ISite>({
    enableReinitialize: true,
    initialValues: {...defaultSite, organizationId: orgId},
    onSubmit: (data: any) => {
      setSubmitting(true)
      if (siteId) {
        //call service update Site
        new SitesService(axiosClient)
          .editSite(data)
          .then((response: any) => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            onSavedSuccess(response.data)
            showSiteSuccessEdited()
            setIsSaveButtonDisabled(true)
            getSite()
            siteDispatch({
              type: SiteActionType.GET_SITE_INFORMATION,
              payload: {
                ...site,
                name: response.data.name,
                url: response.data.url
              },
            })
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleSiteError(err)
          })
      } else {
        //call service create Site
        new SitesService(axiosClient)
          .createSite(data)
          .then((response: any) => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            onSavedSuccess(response.data)
            showSiteSuccessAdded()
            setIsGoBackToSiteList(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleSiteError(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: ISiteErrors = {}

      if (!data.erpId) {
        validErrors.erpId = t('form_validate_required')
      } else if (existsSiteErpId.has(data.erpId.trim())) {
        validErrors.erpId = t('form_validate_duplicated_erp_id')
      } else if (!isValidErpId(data.erpId)) {
        validErrors.erpId = t('form_validate_invalid_erp_id_pattern')
      }
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }
      if (!data.url) {
        validErrors.url = t('form_validate_required')
      } else if (!data.url.match(URL_REGEX)) {
        validErrors.url = t('form_validate_invalid_url')
      } else if (existsSiteUrl.has(extractDomainFromUrl(data.url.trim()))) {
        validErrors.url = t('form_validate_duplicated_site_url')
      }

      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof ISite) =>
    !!(touched[name] && errors[name])

  const getFormErrorMessage = (name: keyof ISite) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const backToSites = () => {
    navigate(ROUTE_SITE.ROOT.replace(ROUTE_PARAMS.ORG_ID, orgId))
  }

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name')
    setValues({...values, [attribute]: event.target.value.trim()})
  }

  const formatInputSwitch = (event: any) => {
    if (event.target.value === true) {
      setValues({...values, status: 'ACTIVE'})
    } else {
      setValues({...values, status: 'INACTIVE'})
    }
  }

  const onHandleSubmit = () => {
    handleSubmit()
  }

  useEffect(() => {
    if (siteId) {
      getSite()
    }
  }, [])

  useEffect(() => {
    isShouldGoBackToSiteList && backToSites()
  }, [isShouldGoBackToSiteList])

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
          siteId
            ? seoProperty.organizationsEditSite
            : seoProperty.organizationsAddSite
        }
      ></SeoConfig>
      <Card className='card-form'>
        <Card.Header>
          <h4 className='card-form__title'>
            {siteId ? t('site_edit_title') : t('site_add_title')}
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
                {siteId ? (
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
                  <Col xs={4} className='col-4 flex align-items-center'>
                    <label
                      htmlFor='erpId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('erpId'),
                      })}
                    >
                      {t('site_add_erpId')}
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
                      className={classNames('p-inputtext-sm', {
                        'p-invalid': isFormFieldValid('erpId'),
                      })}
                      maxLength={16}
                      disabled={!!siteId}
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
                      {t('site_add_organization_name')}
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
                      className={classNames('p-inputtext-sm', {
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
                      htmlFor='url'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('url'),
                      })}
                    >
                      {t('site_add_url')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='url'
                      name='url'
                      value={values.url}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('p-inputtext-sm', {
                        'p-invalid': isFormFieldValid('url'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('url')}</Row>

                <Row className='align-items-center py-1'>
                  <div className='col-4 flex align-items-center'>
                    <label htmlFor='isActive' className=''>
                      {t('site_add_active')}
                    </label>
                  </div>
                  <div className='col-8'>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE' ? true : false}
                      onChange={onSwitchChange}
                      disabled={!!siteId}
                    />
                  </div>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={backToSites}
                      variant='danger'
                    >
                      {t('common_confirm_cancel')}
                    </Button>

                    <Button
                      variant='success'
                      className='me-2'
                      onClick={onHandleSubmit}
                      disabled={
                        isSubmitting ||
                        isSaveButtonDisabled ||
                        (Boolean(siteId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.view_organization_list,
                            PERMISSIONS.edit_site,
                          ]))
                      }
                    >
                      {t('common_confirm_save')}
                    </Button>

                    {Boolean(siteId) &&
                      checkHasPermissions &&
                      checkHasPermissions([
                        PERMISSIONS.view_organization_list,
                        PERMISSIONS.view_site_list,
                        PERMISSIONS.view_site_locale_list
                      ]) && (
                        <Button
                          className='me-2'
                          onClick={() =>
                            navigate(
                              ROUTE_SITE_LOCALE.ROOT.replace(
                                ROUTE_PARAMS.ORG_ID,
                                orgId
                              ).replace(ROUTE_PARAMS.SITE_ID, siteId as string)
                            )
                          }
                        >
                          {t('site_button_goto_locales_label')}
                        </Button>
                      )}
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

export default SiteForm
