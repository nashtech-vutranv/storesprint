import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import {confirmDialog} from 'primereact/confirmdialog'
import {IOrganization} from '../../interface/organization'
import OrganizationService from '../../services/OrganizationService'
import {GlobalContext} from '../../store/GlobalContext'
import {isValidErpId} from '../../helpers/validateErpId'
import {emptyString} from '../../helpers/emptyString'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb'
import DialogTemplate from '../../components/DialogTemplate'
import {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  PERMISSIONS,
  ROUTE_ORG,
  ROUTE_PARAMS,
  ROUTE_SITE,
} from '../../constants'
import {
  useCallbackPrompt,
  useSwitchAccesibility,
  useConditionForm,
  useSecretForm,
  usePersistLocationState,
  useHandleError,
  useGoBack
} from '../../hooks'
import {ToastContext} from '../../providers/'

const defaultOrganization: IOrganization = {
  id: '',
  erpId: '',
  name: '',
  additionalInformation: '',
  contactName: '',
  contactPhoneNumber: '',
  contactEmailAddress: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  postCode: '',
  registrationNumber: '',
  vatRegistrationNumber: '',
  version: 0,
  createdAt: '',
  modifiedAt: '',
  status: 'ACTIVE',
  platformSetting: {
    version: 0,
    apiEndpoint: '',
    authEndpoint: '',
    clientId: '',
    clientSecret: '',
  },
}

type IOrganizationErrors = {
  [key in keyof IOrganization]?: string
}

const UpdateOrganizations = () => {
  const {orgId} = useParams<{orgId: string}>()

  const {t} = useTranslation()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false)
  const [isGoToSiteListPage, setIsGoToSiteListPage] = useState<boolean>(false)
  const [isGoToOrgListPage, setIsGoToOrgListPage] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()
  const {toast} = useContext(ToastContext)
  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {state: persistState} = usePersistLocationState(location)

  const {goBackToViewListPage} = useGoBack(persistState, ROUTE_ORG.ROOT)

  const getOrganization = () => {
    new OrganizationService(axiosClient)
      .getOrganizationAndPlatformSetting(`${orgId}`)
      .then((response: any) => {
        if (response.data.platformSetting) {
          resetForm({values: response.data})
        } else {
          resetForm({
            values: {
              ...response.data,
              platformSetting: {...defaultOrganization.platformSetting},
            },
          })
        }
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
      accept: () => getOrganization(),
    })
  }

  const handleError = (err: any) => {
    if (
      err.response.status === CONFLICT_ERROR ||
      (err.response.status === BAD_REQUEST_ERROR &&
        err.response.data.errorCode === 'INVALID_PLATFORM_SETTING')
    ) {
      setFieldError(
        'platformSetting',
        t('form_validate_invalid_seller_credentials')
      )
      return
    }
    if (err.response.status !== BAD_REQUEST_ERROR) {
      handleErrorResponse(err)
      return
    }
    orgId
      ? concurrentHandling()
      : setFieldError('erpId', t('form_validate_duplicated_erp_id'))
  }

  const {
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldError,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    resetForm,
  } = useFormik<IOrganization>({
    initialValues: defaultOrganization,
    onSubmit: (data: any) => {
      setSubmitting(true)

      if (orgId) {
        new OrganizationService(axiosClient)
          .editOrganization(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showOrganizationSuccessEdited()
            getOrganization()
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleError(err)
          })
      } else {
        new OrganizationService(axiosClient)
          .addOrganization(data)
          .then(() => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            showOrganizationSuccessAdded()
            setIsGoToOrgListPage(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleError(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: IOrganizationErrors = {}

      if (!data.erpId) {
        validErrors.erpId = t('form_validate_required')
      } else if (!isValidErpId(data.erpId)) {
        validErrors.erpId = t('form_validate_invalid_erp_id_pattern')
      }
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }
      if (!data.contactName) {
        validErrors.contactName = t('form_validate_required')
      }
      if (!data.contactEmailAddress) {
        validErrors.contactEmailAddress = t('form_validate_required')
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          data.contactEmailAddress
        )
      ) {
        validErrors.contactEmailAddress = t('form_validate_invalid_email')
      }
      if (!data.addressLine1) {
        validErrors.addressLine1 = t('form_validate_required')
      }
      if (!data.city) {
        validErrors.city = t('form_validate_required')
      }
      if (!data.postCode) {
        validErrors.postCode = t('form_validate_required')
      }
      if (
        data.contactPhoneNumber &&
        !/^[0-9()+]+$/.test(data.contactPhoneNumber)
      ) {
        validErrors.contactPhoneNumber = t('form_validate_invalid_phone_number')
      }

      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IOrganization) =>
    !!(touched[name] && errors[name])

  const getFormErrorMessage = (name: keyof IOrganization) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const handleCancel = () => {
    goBackToViewListPage()
  }

  const showOrganizationSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_added_organization'),
      life: 5000,
    })
  }

  const showOrganizationSuccessEdited = () => {
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

  const formatInputSwitch = (event: any) => {
    setValues({
      ...values,
      status: Boolean(event.target.value) ? 'ACTIVE' : 'INACTIVE',
    })
  }

  useEffect(() => {
    if (orgId) {
      getOrganization()
    }
  }, [])

  useEffect(() => {
    isGoToOrgListPage && navigate(ROUTE_ORG.ROOT)
  }, [isGoToOrgListPage])

  const {isSaveButtonDisabled, onInputChange, onSwitchChange} =
    useConditionForm(handleChange, formatInputSwitch)

  const {inputsRef, iconsRef, toggleHidingInput} = useSecretForm(4)

  useCallbackPrompt(!isSubmitSuccess && dirty, !isGoToSiteListPage ? persistState : null)

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={
          orgId ? seoProperty.organizationsEdit : seoProperty.organizationsAdd
        }
      ></SeoConfig>
      {orgId && (
        <BreadCrumb breadCrumbItems={[{label: values.name, active: true}]} />
      )}
      <Card
        className={classNames('card-form', {
          'mt-3': !orgId,
        })}
      >
        <Card.Header>
          <h4 className='card-form__title'>
            {orgId ? t('organization_edit_title') : t('organization_add_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <form
              className='form-layout'
              onSubmit={handleSubmit}
              autoComplete='on'
            >
              <Container fluid className='create-organization-form'>
                {orgId ? (
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
                      {t('organization_details_erpId')}
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
                      maxLength={16}
                      disabled={!!orgId}
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
                      {t('organization_details_name')}
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
                {getFormErrorMessage('name')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='additionalInformation' className=''>
                      {t('organization_details_additional_information')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='additionalInformation'
                      name='additionalInformation'
                      value={emptyString(values.additionalInformation)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className='w-full p-1'
                      maxLength={512}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center'>
                  <Col xs={12} className='mt-3'>
                    <label
                      htmlFor='additionalInformation'
                      className='fs-4 fw-bold'
                    >
                      {t('organization_details_contact_information')}:
                    </label>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='contactName'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('contactName'),
                      })}
                    >
                      {t('organization_details_contact_name')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='contactName'
                      name='contactName'
                      value={emptyString(values.contactName)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('contactName'),
                      })}
                      maxLength={64}
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('contactName')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='contactPhoneNumber'
                      className={classNames({
                        'p-error': isFormFieldValid('contactPhoneNumber'),
                      })}
                    >
                      {t('organization_details_contact_phone_number')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='contactPhoneNumber'
                      name='contactPhoneNumber'
                      value={emptyString(values.contactPhoneNumber)}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('contactPhoneNumber'),
                      })}
                      maxLength={64}
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('contactPhoneNumber')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='contactEmailAddress'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('contactEmailAddress'),
                      })}
                    >
                      {t('organization_details_contact_email_address')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='contactEmailAddress'
                      name='contactEmailAddress'
                      value={emptyString(values.contactEmailAddress)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('contactEmailAddress'),
                      })}
                      maxLength={256}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('contactEmailAddress')}</Row>

                <Row className='align-items-center'>
                  <Col xs={12} className='mt-3'>
                    <label
                      htmlFor='additionalInformation'
                      className='fs-4 fw-bold'
                    >
                      {t('organization_details_address')}:
                    </label>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='addressLine1'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('addressLine1'),
                      })}
                    >
                      {t('organization_details_address_line_1')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine1'
                      name='addressLine1'
                      value={emptyString(values.addressLine1)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('addressLine1'),
                      })}
                      maxLength={128}
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('addressLine1')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='addressLine2' className=''>
                      {t('organization_details_address_line_2')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine2'
                      name='addressLine2'
                      value={emptyString(values.addressLine2)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className='w-full p-1'
                      maxLength={128}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='addressLine3' className=''>
                      {t('organization_details_address_line_3')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine3'
                      name='addressLine3'
                      value={emptyString(values.addressLine3)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className='w-full p-1'
                      maxLength={128}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='city'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('city'),
                      })}
                    >
                      {t('organization_details_city')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='city'
                      name='city'
                      value={values.city}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('city'),
                      })}
                      maxLength={64}
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('city')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='postCode'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('postCode'),
                      })}
                    >
                      {t('organization_details_post_code')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='postCode'
                      name='postCode'
                      value={values.postCode}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('postCode'),
                      })}
                      maxLength={16}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('postCode')}</Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='registrationNumber' className=''>
                      {t('organization_details_registration_number')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='registrationNumber'
                      name='registrationNumber'
                      value={emptyString(values.registrationNumber)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className='w-full p-1'
                      maxLength={64}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='vatRegistrationNumber' className=''>
                      {t('organization_details_vat_registration_number')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='vatRegistrationNumber'
                      name='vatRegistrationNumber'
                      value={emptyString(values.vatRegistrationNumber)}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className='p-1'
                      maxLength={64}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('organization_details_status_active')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE' ? true : false}
                      onChange={onSwitchChange}
                      disabled={!!orgId}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center'>
                  <Col xs={12} className='mt-3'>
                    <label
                      htmlFor='ecommercePlatformConnection'
                      className='fs-4 fw-bold'
                    >
                      {t('organization_details_ecommerce_platform_connection')}
                    </label>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='platformSetting.clientId'>
                      {t('organization_details_client_id')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <span className='p-input-icon-right p-sensitive-input-icon-right'>
                      <i
                        className='pi pi-eye-slash'
                        onClick={() => {
                          toggleHidingInput(
                            inputsRef.current[0],
                            iconsRef.current[0],
                            'eyeSlash'
                          )
                        }}
                        ref={iconsRef.current[0]}
                      />
                      <InputText
                        type='password'
                        id='platformSetting.clientId'
                        name='platformSetting.clientId'
                        value={emptyString(values.platformSetting?.clientId)}
                        onChange={onInputChange}
                        onBlur={(e) => {
                          handleBlur(e)
                          formatInput(e)
                        }}
                        className='w-full p-1 p-sensitive-input'
                        ref={inputsRef.current[0]}
                        onCopy={(e) => {
                          e.preventDefault()
                          return false
                        }}
                      />
                    </span>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='platformSetting.clientSecret'>
                      {t('organization_details_client_secret')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <span className='p-input-icon-right p-sensitive-input-icon-right'>
                      <i
                        className='pi pi-eye-slash'
                        onClick={() => {
                          toggleHidingInput(
                            inputsRef.current[1],
                            iconsRef.current[1],
                            'eyeSlash'
                          )
                        }}
                        ref={iconsRef.current[1]}
                      />
                      <InputText
                        type='password'
                        id='platformSetting.clientSecret'
                        name='platformSetting.clientSecret'
                        value={emptyString(
                          values.platformSetting?.clientSecret
                        )}
                        onChange={onInputChange}
                        onBlur={(e) => {
                          handleBlur(e)
                          formatInput(e)
                        }}
                        className='w-full p-1 p-sensitive-input'
                        ref={inputsRef.current[1]}
                        onCopy={(e) => {
                          e.preventDefault()
                          return false
                        }}
                      />
                    </span>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='platformSetting.apiEndpoint'>
                      {t('organization_details_api_endpoint')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <span className='p-input-icon-right p-sensitive-input-icon-right'>
                      <i
                        className='pi pi-eye-slash'
                        onClick={() => {
                          toggleHidingInput(
                            inputsRef.current[2],
                            iconsRef.current[2],
                            'eyeSlash'
                          )
                        }}
                        ref={iconsRef.current[2]}
                      />
                      <InputText
                        type='password'
                        id='platformSetting.apiEndpoint'
                        name='platformSetting.apiEndpoint'
                        value={emptyString(values.platformSetting?.apiEndpoint)}
                        onChange={onInputChange}
                        onBlur={(e) => {
                          handleBlur(e)
                          formatInput(e)
                        }}
                        className='w-full p-1 p-sensitive-input'
                        ref={inputsRef.current[2]}
                      />
                    </span>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='platformSetting.authEndpoint'>
                      {t('organization_details_auth_endpoint')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <span className='p-input-icon-right p-sensitive-input-icon-right'>
                      <i
                        className='pi pi-eye-slash'
                        onClick={() => {
                          toggleHidingInput(
                            inputsRef.current[3],
                            iconsRef.current[3],
                            'eyeSlash'
                          )
                        }}
                        ref={iconsRef.current[3]}
                      />
                      <InputText
                        type='password'
                        id='platformSetting.authEndpoint'
                        name='platformSetting.authEndpoint'
                        value={emptyString(values.platformSetting?.authEndpoint)}
                        onChange={onInputChange}
                        onBlur={(e) => {
                          handleBlur(e)
                          formatInput(e)
                        }}
                        className='w-full p-1 p-sensitive-input'
                        ref={inputsRef.current[3]}
                      />
                    </span>
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('platformSetting')}</Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={handleCancel}
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
                        (Boolean(orgId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([PERMISSIONS.edit_org_details]))
                      }
                    >
                      {t('common_confirm_save')}
                    </Button>
                    {Boolean(orgId) &&
                      checkHasPermissions &&
                      checkHasPermissions([
                        PERMISSIONS.view_organization_list,
                        PERMISSIONS.view_site_list,
                      ]) && (
                        <Button
                          className='me-2'
                          onClick={() => {
                            setIsGoToSiteListPage(true)
                            navigate(
                              ROUTE_SITE.ROOT.replace(
                                ROUTE_PARAMS.ORG_ID,
                                orgId as string
                              )
                            )
                          }
                            
                          }
                        >
                          {t('organization_button_sites_label')}
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

export default UpdateOrganizations
