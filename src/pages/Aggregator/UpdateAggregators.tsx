import React, {useState, useContext, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useParams, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {confirmDialog} from 'primereact/confirmdialog'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import classNames from 'classnames'
import {IAggregator} from '../../interface/aggregator'
import {ToastContext} from '../../providers'
import {BAD_REQUEST_ERROR, CONFLICT_ERROR, ROUTE_AGGREGATOR} from '../../constants'
import AggregatorService from '../../services/AggregatorService'
import {GlobalContext} from '../../store/GlobalContext'
import DialogTemplate from '../../components/DialogTemplate'
import {useCallbackPrompt, useCommonAccesibility, useSwitchAccesibility, useConditionForm, useHandleError} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'

const defaultAggregator: IAggregator = {
  id: '',
  name: '',
  version: 0,
  status: 'ACTIVE',
}

type IAggregatorErrors = {
  [key in keyof IAggregator]?: string
}

export default function UpdateAggregators() {
  const {aggregatorId} = useParams<{aggregatorId: string}>()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {toast} = useContext(ToastContext)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  useEffect(() => {
    if (aggregatorId) {
      getAggregator()
    }
  }, [])

  useCommonAccesibility()

  const getAggregator = () => {
    new AggregatorService(axiosClient)
      .fetchAggregatorById(aggregatorId)
      .then((response: any) => {
        resetForm({values: response.data})
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
      accept: () => getAggregator(),
    })
  }

  const isFormFieldValid = (name: keyof IAggregator) => {
    return !!(touched[name] && errors[name])
  }

  const backToAggregators = () => {
    navigate(ROUTE_AGGREGATOR.ROOT)
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

  const getFormErrorMessage = (name: keyof IAggregator) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const showAggregatorSuccessEdited = () => {
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
    setFieldError,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    resetForm,
  } = useFormik<IAggregator>({
    initialValues: defaultAggregator,
    onSubmit: (data: any) => {
      setSubmitting(true)

      if (aggregatorId) {
        new AggregatorService(axiosClient)
          .editAggregator(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showAggregatorSuccessEdited()
            backToAggregators()
            getAggregator()
          })
          .catch((err: any) => {
            setSubmitting(false)
            if(err.response.status === CONFLICT_ERROR) {
              setFieldError('name', t('form_validate_duplicated_name'))
            } else if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            } else {
              concurrentHandling()
            }
          })
      } else {
        new AggregatorService(axiosClient)
          .addAggregator(data)
          .then(() => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_aggregator'),
              life: 5000,
            })
            navigate(ROUTE_AGGREGATOR.ROOT)
          })
          .catch((err: any) => {
            setSubmitting(false)
            if(err.response.status === CONFLICT_ERROR) {
              setFieldError('name', t('form_validate_duplicated_name'))
            } else if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            }
          })
      }
    },
    validate: (data: any) => {
      let validErrors: IAggregatorErrors = {}
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }

      return validErrors
    },
  })

  const {
    isSaveButtonDisabled,
    onInputChange,
    onSwitchChange
  } = useConditionForm(handleChange, formatInputSwitch)

  useCallbackPrompt(!isSubmitSuccess && dirty)

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={
          aggregatorId ? seoProperty.aggregatorEdit : seoProperty.aggregatorAdd
        }
      ></SeoConfig>
      <Card
        className='card-form mt-3'
      >
        <Card.Header>
          <h4 className='card-form__title'>
            {aggregatorId
              ? t('aggregator_edit_title')
              : t('aggregator_add_title')}
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
                {aggregatorId && (
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
                      htmlFor='name'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('name'),
                      })}
                    >
                      {t('aggregator_details_name')}
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
                    <label htmlFor='isActive' className=''>
                      {t('aggregator_details_status_active')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE'}
                      onChange={onSwitchChange}
                      disabled={Boolean(aggregatorId)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={() =>navigate(ROUTE_AGGREGATOR.ROOT)}
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
