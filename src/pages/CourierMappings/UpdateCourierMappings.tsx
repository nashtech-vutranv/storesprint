import classNames from 'classnames'
import {useFormik} from 'formik'
import {confirmDialog} from 'primereact/confirmdialog'
import {useContext, useEffect, useState} from 'react'
import Select from 'react-select'
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import CreatableSelect from 'react-select/creatable'
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
  useHandleError
} from '../../hooks'
import {ToastContext} from '../../providers'
import {GlobalContext} from '../../store/GlobalContext'
import CourierServices from '../../services/CourierService'
import {transformToSelectData} from '../../helpers/select'
import {ISelectOption} from '../../interface/selectOption'
import {ICreateUpdateCourierMapping} from '../../interface/courierMapping'
import MappingService from '../../services/MappingService'
import {BAD_REQUEST_ERROR, PERMISSIONS} from '../../constants'

const defaultCourierMapping: ICreateUpdateCourierMapping = {
  id: '',
  version: 0,
  status: 'ACTIVE',
  mmsValue: '',
  marketplaceTypeId: '',
  marketplaceValue: '',
  marketplaceCode: '',
}

type ICreateUpdateCourierMappingErrors = {
  [key in keyof ICreateUpdateCourierMapping]?: string
}

export default function UpdateCourierMappings() {
  const {t} = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()
  const {state: persistSate} = usePersistLocationState(location)
  const {courierMappingId} = useParams<{courierMappingId: string}>()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [couriers, setCouriers] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const [selectedCourier, setSelectedCourier] = useState<ISelectOption | null>(
    null
  )

  const [marketplaceTypeOptions, setMarketplaceTypeOption] = useState<
    ISelectOption[]
  >([])
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(null)

  const [marketplaceCourier, setMarketplaceCourier] = useState<
    {
      label: string
      value: string
      marketplaceCode: string
    }[]
  >([])

  const [selectedMarketplaceCourier, setSelectedMarketplaceCourier] = useState<{
    label: string
    value: string
    marketplaceCode: string
  } | null>(null)

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  useEffect(() => {
    getCouriers()
    getMarketplaceTypes()
    if (courierMappingId) {
      getMarketplaceMapping()
    }
  }, [])

  useEffect(() => {
    if (selectedMarketplaceType) {
      getMarketplaceCourier(selectedMarketplaceType)
    }
  }, [selectedMarketplaceType])

  const getCouriers = () => {
    new CourierServices(axiosClient)
      .getAllCouriers()
      .then((response) => {
        setCouriers(
          response.data.map((item: any) => ({
            label: item.courierProviderName,
            value: item.courierProviderName,
          }))
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getMarketplaceTypes = () => {
    new MappingService(axiosClient)
      .getAllMappingMarketplaces()
      .then((response) => {
        const options = transformToSelectData(response.data)
        setMarketplaceTypeOption(options)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getMarketplaceCourier = (_selectedMarketplaceType: ISelectOption) => {
    new CourierServices(axiosClient)
      .getMarketplaceCourier(_selectedMarketplaceType.value)
      .then((response) => {
        setMarketplaceCourier(
          response.data.map((item: any) => ({
            label: item.marketplaceValue,
            value: item.marketplaceValue,
            marketplaceCode: item.marketplaceCode,
          }))
        )
      })
      .catch((err: any) => {
        handleErrorResponse(err)
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

  const isFormFieldValid = (name: keyof ICreateUpdateCourierMappingErrors) => {
    return !!(touched[name] && errors[name])
  }

  const getMarketplaceMapping = async () => {
    try {
      const marketplaceMappingResponse = await new MappingService(
        axiosClient
      ).getMarketplaceMapping(`${courierMappingId}`)
      const {
        version,
        mmsValue,
        marketplaceType,
        marketplaceTypeId: marketplaceTypeIdResponse,
        marketplaceValue,
        mappingTarget,
      } = marketplaceMappingResponse.data
      setSelectedCourier({
        label: mmsValue,
        value: mmsValue,
      })
      setSelectedMarketplaceType({
        label: marketplaceType.name,
        value: marketplaceType.id,
      })
      setSelectedMarketplaceCourier({
        label: marketplaceValue,
        value: marketplaceValue,
        marketplaceCode: mappingTarget.marketplaceCode,
      })
      resetForm({
        values: {
          ...values,
          mmsValue,
          marketplaceTypeId: marketplaceTypeIdResponse,
          marketplaceValue,
          marketplaceCode: mappingTarget.marketplaceCode,
          version,
        },
      })
    } catch (err: any) {
      handleErrorResponse(err)
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
        setSelectedCourier(selectedValue)
        break
      case 'marketplaceTypeId':
        setFieldValue('marketplaceTypeId', selectedValue.value)
        setSelectedMarketplaceType(selectedValue)
        break
      case 'marketplaceValue':
        setFieldValue('marketplaceCode', selectedValue.marketplaceCode)
        setFieldValue('marketplaceValue', selectedValue.value)
        setSelectedMarketplaceCourier(selectedValue)
        break
    }
  }

  const onBackToList = () => {
    navigate(-1)
  }

  const handleAddMappingError = (_err: any) => {
    setErrorMessage(t('courier_mapping_value_invalid_value_error_message'))
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldTouched,
    setFieldValue,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    dirty,
    resetForm,
  } = useFormik<ICreateUpdateCourierMapping>({
    initialValues: defaultCourierMapping,
    onSubmit: (data: ICreateUpdateCourierMapping) => {
      setSubmitting(true)
      if (courierMappingId) {
        new CourierServices(axiosClient)
          .updateCourierMapping(data, courierMappingId)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showDefaultPropertyValueSuccessEdited()
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === BAD_REQUEST_ERROR) {
              if (err.response.data.errorCode !== 'VERSION_NOT_MATCH') {
                handleErrorResponse(err, handleAddMappingError)
                return
              }
              concurrentHandling()
            }
            handleErrorResponse(err)
          })
      } else {
        new CourierServices(axiosClient)
          .addCourierMapping(data)
          .then(() => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            toast?.current.show({
              severity: 'success',
              summary: t('toast_success_title'),
              detail: t('toast_success_added_courier_mapping'),
              life: 5000,
            })
          })
          .catch((err: any) => {
            setSubmitting(false)
            if (err.response.status === BAD_REQUEST_ERROR) {
              handleErrorResponse(err, handleAddMappingError)
              return
            }
            handleErrorResponse(err)
          })
      }
    },
    validate: (data: any) => {
      let validErrors: ICreateUpdateCourierMappingErrors = {}
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

  useCallbackPrompt(!isSubmitSuccess && dirty, persistSate)

  if (isSubmitSuccess) {
    onBackToList()
  }

  return (
    <>
      <SeoConfig
        seoProperty={
          courierMappingId
            ? seoProperty.courierMappingEdit
            : seoProperty.courierMappingAdd
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {courierMappingId
              ? t('courier_mapping_edit_title')
              : t('courier_mapping_add_title')}
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
                      {t('courier_mapping_value_field_courier')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    {!courierMappingId && (
                      <CreatableSelect
                        onChange={(op) => onSelectChange(op, 'mmsValue')}
                        onBlur={(_e) => {
                          setFieldTouched('mmsValue')
                        }}
                        className={classNames('react-select inherit-color', {
                          'invalid-field': isFormFieldValid('mmsValue'),
                        })}
                        placeholder={t(
                          'courier_mapping_value_field_courier_placeholder'
                        )}
                        options={couriers}
                        isSearchable
                        isClearable
                        value={selectedCourier}
                        classNamePrefix='react-select'
                      />
                    )}
                    {courierMappingId && (
                      <Select
                        onChange={(op) => onSelectChange(op, 'mmsValue')}
                        onBlur={(_e) => {
                          setFieldTouched('mmsValue')
                        }}
                        className={classNames('react-select inherit-color', {
                          'invalid-field': isFormFieldValid('mmsValue'),
                        })}
                        placeholder={t(
                          'courier_mapping_value_field_courier_placeholder'
                        )}
                        options={couriers}
                        isSearchable
                        isClearable
                        value={selectedCourier}
                        isDisabled
                        classNamePrefix='react-select'
                      />
                    )}
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
                      {t(
                        'product_category_mappings_filter_marketplace_type_label'
                      )}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceTypeId'
                      name='marketplaceTypeId'
                      options={marketplaceTypeOptions}
                      placeholder={t(
                        'product_category_mappings_filter_marketplace_type_placeHolder'
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
                      isDisabled={Boolean(courierMappingId)}
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
                      {t('courier_mapping_value_field_marketplace_courier')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceValue'
                      name='marketplaceValue'
                      options={marketplaceCourier}
                      placeholder={t(
                        'courier_mapping_value_field_marketplace_courier_placeholder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'marketplaceValue')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceValue'),
                      })}
                      value={selectedMarketplaceCourier}
                      onBlur={(_e) => {
                        setFieldTouched('marketplaceValue')
                      }}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={{span: 8, offset: 4}} className='py-0'>
                    <small className='p-error text-sm'>{errorMessage}</small>
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
                        (Boolean(courierMappingId) &&
                          checkHasPermissions &&
                          !checkHasPermissions([
                            PERMISSIONS.edit_courier_mapping,
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
