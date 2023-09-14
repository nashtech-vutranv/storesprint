import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import {useEffect, useContext, useState} from 'react'
import {confirmDialog} from 'primereact/confirmdialog'
import {IWarehouse} from '../../../interface/warehouse'
import {seoProperty} from '../../../constants/seo-url'
import SeoConfig from '../../../components/SEO/SEO-Component'
import {GlobalContext} from '../../../store/GlobalContext'
import WarehouseServices from '../../../services/WarehouseService'
import {
  useCallbackPrompt,
  useSwitchAccesibility,
  useConditionForm,
  usePersistLocationState,
  useHandleError
} from '../../../hooks'
import DialogTemplate from '../../../components/DialogTemplate'
import {ToastContext} from '../../../providers'
import {BAD_REQUEST_ERROR, PERMISSIONS} from '../../../constants'

const defaultWarehouse: IWarehouse = {
  id: '',
  erpId: '',
  name: '',
  status: 'ACTIVE',
  version: 0,
  createdAt: '',
  modifiedAt: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  country: '',
}

type IWarehouseErrors = {
  [key in keyof IWarehouse]?: string
}

const EditWarehouse = () => {
  const {warehouseId} = useParams<{warehouseId: string}>()
  const {toast} = useContext(ToastContext)
  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const {t} = useTranslation()

  useEffect(() => {
    if (warehouseId) {
      getWarehouse()
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('[role="checkbox"]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
    })
    document.querySelectorAll('[role="switch"]').forEach((el) => {
      el.setAttribute('aria-label', 'switch')
    })
  }, [])

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getWarehouse(),
    })
  }

  const getWarehouse = () => {
    new WarehouseServices(axiosClient)
      .getWarehouseById(warehouseId)
      .then((response: any) => {
        resetForm({values: response.data})
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const showWarehouseSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
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
  } = useFormik<IWarehouse>({
    initialValues: defaultWarehouse,
    onSubmit: (data: any) => {
      setSubmitting(true)
      new WarehouseServices(axiosClient)
        .editWarehouse(data)
        .then(() => {
          setSubmitting(true)
          setIsSubmitSuccess(true)
          showWarehouseSuccessEdited()
        })
        .catch((err: any) => {
          setSubmitting(false)
          if (err.response.status !== BAD_REQUEST_ERROR) {
            handleErrorResponse(err)
          } else {
            concurrentHandling()
          }
        })
    },
    validate: (data: any) => {
      let validErrors: IWarehouseErrors = {}

      if (!data.erpId) {
        validErrors.erpId = t('form_validate_required')
      }
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }
      if (!data.addressLine1) {
        validErrors.addressLine1 = t('form_validate_required')
      }
      if (!data.country) {
        validErrors.country = t('form_validate_required')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IWarehouse) =>
    !!(touched[name] && errors[name])

  const backToWarehouses = () => {
    navigate(-1)
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

  const {isSaveButtonDisabled, onInputChange, onSwitchChange} =
    useConditionForm(handleChange, formatInputSwitch)

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  if (isSubmitSuccess) {
    backToWarehouses()
  }

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig seoProperty={seoProperty.warehouseEdit}></SeoConfig>
      <Card className='card-form form-warehouse mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>{t('warehouse_edit_page_title')}</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <form
              className='form-layout'
              onSubmit={handleSubmit}
              autoComplete='on'
            >
              <Container fluid>
                <Row className='mb-2'>
                  <Col>
                    <p className='d-flex align-items-center m-0'>
                      <i className='mdi mdi-alert-circle fs-3 pe-1' />
                      {t('warehouse_edit_warning_message')}
                    </p>
                  </Col>
                </Row>
                {warehouseId ? (
                  <Row className='align-items-center py-1'>
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
                      {t('warehouse_edit_erpId')}
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
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('erpId'),
                      })}
                      maxLength={64}
                      disabled={!!warehouseId}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='name'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('name'),
                      })}
                    >
                      {t('warehouse_edit_organization_name')}
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
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('name'),
                      })}
                      maxLength={128}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center'>
                  <Col xs={12} className='mt-3'>
                    <label
                      htmlFor='additionalInformation'
                      className='fs-4 fw-bold'
                    >
                      {t('warehouse_edit_warehouse_address')}:
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
                      {t('warehouse_edit_warehouse_addressLine1')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine1'
                      name='addressLine1'
                      value={values.addressLine1 || ''}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('addressLine1'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='addressLine2'
                      className={classNames({
                        'p-error': isFormFieldValid('addressLine2'),
                      })}
                    >
                      {t('warehouse_edit_warehouse_addressLine2')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine2'
                      name='addressLine2'
                      value={values.addressLine2 || ''}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('addressLine2'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='addressLine3'
                      className={classNames({
                        'p-error': isFormFieldValid('addressLine3'),
                      })}
                    >
                      {t('warehouse_edit_warehouse_addressLine3')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='addressLine3'
                      name='addressLine3'
                      value={values.addressLine3 || ''}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('addressLine3'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='country'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('country'),
                      })}
                    >
                      {t('warehouse_edit_warehouse_country')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='country'
                      name='country'
                      value={values.country || ''}
                      onBlur={(e) => {
                        handleBlur(e)
                        formatInput(e)
                      }}
                      onChange={onInputChange}
                      className={classNames('p-1', {
                        'p-invalid': isFormFieldValid('country'),
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('warehouse_edit_active')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
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
                      onClick={backToWarehouses}
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
                        (Boolean(warehouseId) && checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.edit_warehouse,
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

export default EditWarehouse
