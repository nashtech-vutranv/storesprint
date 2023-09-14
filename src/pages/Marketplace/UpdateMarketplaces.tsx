import React, {useState, useContext, useEffect} from 'react'
import {AxiosResponse} from 'axios'
import _ from 'lodash'
import {useTranslation} from 'react-i18next'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import Select from 'react-select'
import {confirmDialog} from 'primereact/confirmdialog'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import classNames from 'classnames'
import {
  IMarketplaceFormRequest,
  IMarketplaceFormResponse,
} from '../../interface/marketplace'
import {ToastContext} from '../../providers'
import {BAD_REQUEST_ERROR, CONFLICT_ERROR, PERMISSIONS, ROUTE_MARKETPLACE} from '../../constants'
import MarketplaceService from '../../services/MarketplaceService'
import CurrencyService from '../../services/CurrencyService'
import {GlobalContext} from '../../store/GlobalContext'
import DialogTemplate from '../../components/DialogTemplate'
import {
  useCallbackPrompt,
  useCommonAccesibility,
  useSwitchAccesibility,
  useConditionForm,
  useHandleError,
  usePersistLocationState,
} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {transformToSelectData} from '../../helpers/select'
import {ISelectOption} from '../../interface/selectOption'

const defaultMarketplace: IMarketplaceFormRequest = {
  id: '',
  name: '',
  currencyId: '',
  status: 'ACTIVE',
  marketplaceTypeId: '',
  version: 0,
}

type IMarketplaceErrors = {
  [key in keyof IMarketplaceFormRequest]?: string
}

export default function UpdateMarketplaces() {
  const {marketplaceId} = useParams<{marketplaceId: string}>()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const {toast} = useContext(ToastContext)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [currencies, setCurrencies] = useState<ISelectOption[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<any>(null)
  const [selectedCurrency, setSelectedCurrency] =
    useState<ISelectOption | null>(null)
  const [isShouldBackToMarketplaceList, setIsShouldBackToMarketplaceList] = useState<boolean>(false)
  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  useEffect(() => {
    new CurrencyService(axiosClient).fetchAllCurrencies().then((response) => {
      setCurrencies(transformToSelectData(response.data))
    })
  }, [])

  useEffect(() => {
    new MarketplaceService(axiosClient)
      .getMarketplaceTypeInformation()
      .then((response: any) => {
        setTypes(
          response.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (marketplaceId && currencies.length !== 0) {
      getMarketplace()
    }
  }, [currencies])

  const getMarketplace = () => {
    new MarketplaceService(axiosClient)
      .fetchMarketplaceById(marketplaceId)
      .then((response: AxiosResponse<IMarketplaceFormResponse>) => {
        resetForm({
          values: {
            ..._.omit(response.data, ['createdAt', 'modifiedAt']),
            marketplaceTypeId: response.data.marketplaceType.id,
          },
        })
        setSelectedCurrency({
          label: response.data.currency.name,
          value: response.data.currency.id,
        })
        setSelectedType({
          label: response.data.marketplaceType.name,
          value: response.data.marketplaceType.id,
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
      accept: () => getMarketplace(),
    })
  }

  const isFormFieldValid = (name: keyof IMarketplaceFormRequest) => {
    return !!(touched[name] && errors[name])
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

  const getFormErrorMessage = (name: keyof IMarketplaceFormRequest) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
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
  } = useFormik<IMarketplaceFormRequest>({
    initialValues: defaultMarketplace,
    onSubmit: (data: any) => {
      setSubmitting(true)

      if (marketplaceId) {
        new MarketplaceService(axiosClient)
          .editMarketplace(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_modified'),
              life: 5000,
            })
            setIsShouldBackToMarketplaceList(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === CONFLICT_ERROR) {
              setFieldError('name', t('form_validate_duplicated_name'))
            } else if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            } else {
              concurrentHandling()
            }
          })
      } else {
        new MarketplaceService(axiosClient)
          .addMarketplace(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_marketplace'),
              life: 5000,
            })
            setIsShouldBackToMarketplaceList(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === CONFLICT_ERROR) {
              setFieldError('name', t('form_validate_duplicated_name'))
            } else if (err.response.status !== BAD_REQUEST_ERROR) {
              handleErrorResponse(err)
            }
          })
      }
    },
    validate: (data: any) => {
      let validErrors: IMarketplaceErrors = {}
      if (!data.name) {
        validErrors.name = t('form_validate_required')
      }

      if (!data.currencyId) {
        validErrors.currencyId = t('form_validate_required')
      }

      if (!data.marketplaceTypeId) {
        validErrors.marketplaceTypeId = t('form_validate_required')
      }

      return validErrors
    },
  })

  const onSelectChange = (selectedValue: any, fieldName: string) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    switch (fieldName) {
      case 'currencyId':
        setSelectedCurrency(selectedValue)
        setFieldValue('currencyId', selectedValue.value)
        break
      case 'marketplaceTypeId':
        setFieldValue('marketplaceTypeId', selectedValue.value)
        setSelectedType(selectedValue)
        break
    }
  }

  const onBlurSelectionChange = (e: any, fieldName: string) => {
    switch (fieldName) {
      case 'currencyId':
        setTouched({
          ...touched,
          currencyId: true,
        })
        break
      case 'marketplaceTypeId':
        setTouched({
          ...touched,
          marketplaceTypeId: true,
        })
        break
    }
    handleBlur(e.nativeEvent)
  }

  const {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onInputChange,
    onSwitchChange,
  } = useConditionForm(handleChange, formatInputSwitch)

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  useCommonAccesibility()

  useSwitchAccesibility(values)

  useEffect(() => {
    isShouldBackToMarketplaceList && navigate(ROUTE_MARKETPLACE.ROOT)
  }, [isShouldBackToMarketplaceList])

  return (
    <>
      <SeoConfig
        seoProperty={
          marketplaceId
            ? seoProperty.marketplaceEdit
            : seoProperty.marketplaceAdd
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {marketplaceId
              ? t('marketplace_edit_title')
              : t('marketplace_add_title')}
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
                {marketplaceId && (
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
                      htmlFor='marketplaceTypeId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('marketplaceTypeId'),
                      })}
                    >
                      {t('marketplace_details_type')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceTypeId'
                      name='marketplaceTypeId'
                      options={types}
                      placeholder={t('marketplace_placeholder_type')}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'marketplaceTypeId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceTypeId'),
                      })}
                      value={selectedType}
                      onBlur={(e) =>
                        onBlurSelectionChange(e, 'marketplaceTypeId')
                      }
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('marketplaceTypeId')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='name'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('name'),
                      })}
                    >
                      {t('marketplace_details_name')}
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
                      htmlFor='currencyId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('currencyId'),
                      })}
                    >
                      {t('marketplace_details_currency')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='currencyId'
                      name='currencyId'
                      options={currencies}
                      placeholder={t('marketplace_placeholder_currency')}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'currencyId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('currencyId'),
                      })}
                      value={selectedCurrency}
                      onBlur={(e) => onBlurSelectionChange(e, 'currencyId')}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
                {getFormErrorMessage('currencyId')}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('marketplace_details_status_active')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE'}
                      onChange={onSwitchChange}
                      disabled={Boolean(marketplaceId)}
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
                          (Boolean(marketplaceId) && checkHasPermissions &&
                            !checkHasPermissions([
                              PERMISSIONS.edit_marketplace,
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
