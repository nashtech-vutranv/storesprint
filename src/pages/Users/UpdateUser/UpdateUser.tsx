import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {confirmDialog} from 'primereact/confirmdialog'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useParams, useNavigate} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import DialogTemplate from '../../../components/DialogTemplate'
import SeoConfig from '../../../components/SEO/SEO-Component'
import {seoProperty} from '../../../constants/seo-url'
import {isValidErpId} from '../../../helpers/validateErpId'
import {
  useCallbackPrompt,
  useCommonAccesibility,
  useSwitchAccesibility,
  useConditionForm,
  useHandleError
} from '../../../hooks'
import {IUser} from '../../../interface/user'
import {ROUTE_USER, ROUTE_RESOURCE, ROUTE_PARAMS, CONFLICT_ERROR} from '../../../constants'
import {GlobalContext} from '../../../store/GlobalContext'
import UserService from '../../../services/UserService'
import {ERROR_FIELD_INVALID} from '../../../constants/common'
import {ToastContext} from '../../../providers'

const defaultUser: IUser = {
  id: '',
  erpId: '',
  name: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  createdAt: '',
  modifiedAt: '',
  version: 0,
  status: 'ACTIVE',
}

type IUserErrors = {
  [key in keyof IUser]?: string
}

const USER_ERROR = {
  DUPLICATE_USER_ERP_ID: 'DUPLICATE_USER_ERP_ID',
  DUPLICATE_USER_EMAIL_ADDRESS: 'DUPLICATE_EMAIL_ADDRESS',
}

const UpdateUser = () => {
  const {userId} = useParams<{userId: string}>()

  const {t} = useTranslation()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [existsErpId, setExistsErpId] = useState(new Set<string>())
  const [existsEmailAddress, setExistsEmailAddress] = useState(
    new Set<string>()
  )
  const [organizationState] = useState(window.history.state ? window.history.state.usr?.selectedOrganization : null)
  const [sitesState] = useState(window.history.state ? window.history.state.usr?.selectedSites : null)

  const navigate = useNavigate()
  const {toast} = useContext(ToastContext)
  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const getUser = () => {
    new UserService(axiosClient)
      .getUserById(userId)
      .then((response: any) => {
        resetForm({values: response.data})
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleUserErrorResponse = (err: any) => {
    setSubmitting(false)
    if (
      err.response.status === CONFLICT_ERROR &&
      err.response.data.errorCode === ERROR_FIELD_INVALID
    ) {
      err.response.data.invalidFields.forEach((invalidField: any) => {
        switch (invalidField.errorMessage) {
          case USER_ERROR.DUPLICATE_USER_ERP_ID:
            // setFieldError('erpId', t('form_validate_duplicated_erp_id'))
            existsErpId.add(values.erpId)
            setExistsErpId(new Set<string>(existsErpId))
            break
          case USER_ERROR.DUPLICATE_USER_EMAIL_ADDRESS:
            // setFieldError('emailAddress', t('form_validate_duplicated_email'))
            existsEmailAddress.add(values.emailAddress)
            setExistsEmailAddress(new Set<string>(existsEmailAddress))
            break
        }
      })
      validateForm()
    } else {
      handleErrorResponse(err)
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
    resetForm,
    validateForm,
  } = useFormik<IUser>({
    initialValues: defaultUser,
    onSubmit: (data: any) => {
      setSubmitting(true)

      if (userId) {
        new UserService(axiosClient)
          .editUser(userId, {
            ...data, 
            erpId: data.erpId === '' ? null : data.erpId
          })
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showSuccessToast('toast_success_modified')
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleErrorResponse(err, concurrentHandling)
          })
      } else {
        new UserService(axiosClient)
          .addUser(data)
          .then(() => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            showSuccessToast('toast_success_added_user')
            backToUsersPage()
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleUserErrorResponse(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: IUserErrors = {}

      if (data.erpId) {
        if (existsErpId.has(data.erpId.trim())) {
          validErrors.erpId = t('form_validate_duplicated_erp_id')
        } else if (!isValidErpId(data.erpId)) {
          validErrors.erpId = t('form_validate_invalid_erp_id_pattern')
        }
      }

      if (!data.firstName) {
        validErrors.firstName = t('form_validate_required')
      }
      if (!data.lastName) {
        validErrors.lastName = t('form_validate_required')
      }

      if (!data.emailAddress) {
        validErrors.emailAddress = t('form_validate_required')
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.emailAddress)
      ) {
        validErrors.emailAddress = t('form_validate_invalid_email')
      } else if (existsEmailAddress.has(data.emailAddress.trim())) {
        validErrors.emailAddress = t('form_validate_duplicated_email')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IUser) =>
    !!(touched[name] && errors[name])

  const getFormErrorMessage = (name: keyof IUser) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const backToUsersPage = () => {
    navigate(ROUTE_USER.ROOT, {
      state: {
        keepFilter: true,
        selectedOrganization: organizationState,
        selectedSites: sitesState,
      },
    })
  }

  const showSuccessToast = (detail: string) => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t(detail),
      life: 5000,
    })
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

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getUser(),
    })
  }

  const {
    isSaveButtonDisabled,
    onInputChange,
    onSwitchChange
  } = useConditionForm(handleChange, formatInputSwitch)

  useEffect(() => {
    if (userId) {
      getUser()
    }
  }, [])

  useCallbackPrompt(!isSubmitSuccess && dirty)

  useCommonAccesibility()

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={userId ? seoProperty.userEdit : seoProperty.userAdd}
      ></SeoConfig>
      <Card className={classNames('card-form', 'mt-3')}>
        <Card.Header>
          <h4 className='card-form__title'>
            {userId ? t('user_edit_page_title') : t('user_add_page_title')}
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
                {userId ? (
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
                    <label htmlFor='erpId'>
                      {t('organization_details_erpId')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='erpId'
                      name='erpId'
                      value={values.erpId ? values.erpId : ''}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('erpId'),
                      })}
                      maxLength={16}
                      disabled={!!userId}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('erpId')}</Row>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='firstName'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('firstName'),
                      })}
                    >
                      {t('user_form_first_name')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='firstName'
                      name='firstName'
                      value={values.firstName}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('firstName'),
                      })}
                      maxLength={128}
                    />
                  </Col>
                </Row>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='lastName'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('lastName'),
                      })}
                    >
                      {t('user_form_last_name')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='lastName'
                      name='lastName'
                      value={values.lastName || ''}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('lastName'),
                      })}
                      maxLength={128}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='contactEmailAddress'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('emailAddress'),
                      })}
                    >
                      {t('user_form_email_address')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='emailAddress'
                      name='emailAddress'
                      value={values.emailAddress || ''}
                      onChange={onInputChange}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      className={classNames('w-full p-1', {
                        'p-invalid': isFormFieldValid('emailAddress'),
                      })}
                      maxLength={256}
                      disabled={!!userId}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('emailAddress')}</Row>

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
                      disabled
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={() => backToUsersPage()}
                      variant='danger'
                    >
                      {t('common_confirm_cancel')}
                    </Button>
                    <Button
                      variant='success'
                      className='me-2'
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting || isSaveButtonDisabled}
                    >
                      {t('common_confirm_save')}
                    </Button>
                    {userId && (
                      <Button
                        className='me-2'
                        onClick={() =>
                          navigate(
                            ROUTE_RESOURCE.ROOT.replace(
                              ROUTE_PARAMS.USER_ID,
                              userId
                            )
                          )
                        }
                      >
                        {t('user_form_button_assigned_resources')}
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

export default UpdateUser
