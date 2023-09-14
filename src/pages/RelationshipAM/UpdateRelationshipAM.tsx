import React, {useState, useContext, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import Select from 'react-select'
import {InputSwitch} from 'primereact/inputswitch'
import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import classNames from 'classnames'
import {IAddRelationshipAM} from '../../interface/relationshipAM'
import {IPagination} from '../../interface/pagination'
import {ToastContext} from '../../providers'
import {BAD_REQUEST_ERROR, ROUTE_RELATIONSHIP_AM} from '../../constants'
import AggregatorService from '../../services/AggregatorService'
import MarketplaceService from '../../services/MarketplaceService'
import RelationshipAMService from '../../services/RelationshipAMService'
import {GlobalContext} from '../../store/GlobalContext'
import {useCallbackPrompt, useCommonAccesibility, useSwitchAccesibility, useConditionForm, useHandleError} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {transformToSelectData} from '../../helpers/select'
import {ISelectOption} from '../../interface/selectOption'

const defaultMarketplace: IAddRelationshipAM = {
  version: 0,
  status: 'ACTIVE',
  aggregatorId: '',
  marketplaceId: ''
}

const paginationAM: IPagination = {
  first: 0,
  rows: 1000,
  page: 1,
  sortField: 'name',
  sortOrder: 1,
  keyword: '',
}

type IAddRelationshipAMErrors = {
  [key in keyof IAddRelationshipAM]?: string
}

export default function UpdateRelationshipAM() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {toast} = useContext(ToastContext)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [aggregators, setAggregators] = useState<ISelectOption[]>([])
  const [selectedAggregator, setSelectedAggregator] = useState<ISelectOption|null>(null)
  const [marketplaces, setMarketplaces] = useState<ISelectOption[]>([])
  const [selectedMarketplace, setSelectedMarketplace] = useState<ISelectOption|null>(null)
  const [messageRelationshipDupplicate, setMessageRelationshipDupplicate] = useState<string>('')

  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const isFormFieldValid = (name: keyof IAddRelationshipAM) => {
    return !!(touched[name] && errors[name])
  }

  const formatInputSwitch = (event: any) => {
    setValues({
      ...values,
      status: Boolean(event.target.value) ? 'ACTIVE' : 'INACTIVE',
    })
  }

  const getFormErrorMessage = (name: keyof IAddRelationshipAM) => {
    return (
      isFormFieldValid(name) &&
      values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const getFormErrorMessageDupplicateRelationship = () => {
    return (
      messageRelationshipDupplicate !== '' && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>
            {messageRelationshipDupplicate}
          </small>
        </Col>
      )
    )
    
  }

  const showRelationshipAMSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_added_relationshipAM'),
      life: 5000,
    })
  }

  const {
    isSubmitting,
    setSubmitting,
    setValues,
    setTouched,
    setFieldValue,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
  } = useFormik<IAddRelationshipAM>({
    initialValues: defaultMarketplace,
    onSubmit: (data: IAddRelationshipAM) => {
      setSubmitting(true)
      new RelationshipAMService(axiosClient)
        .addRelationshipAM(data)
        .then(() => {
          setSubmitting(true)
          setIsSubmitSuccess(true)
          showRelationshipAMSuccessAdded()
          navigate(ROUTE_RELATIONSHIP_AM.ROOT)
        })
        .catch((err: any) => {
          setSubmitting(false)
          if (err.response.data.errorCode === 'DUPLICATE_MARKETPLACE_AGGREGATOR') {
            setMessageRelationshipDupplicate(t('form_validate_duplicated_relationship'))
          } else if (err.response.status !== BAD_REQUEST_ERROR) {
            handleErrorResponse(err)
          }
        })
    },
    validate: (data: any) => {
      let validErrors: IAddRelationshipAMErrors = {}
      if (!data.aggregatorId) {
        validErrors.aggregatorId = t('form_validate_required')
      }

      if (!data.marketplaceId) {
        validErrors.marketplaceId = t('form_validate_required')
      }

      return validErrors
    },
  })

  const {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onSwitchChange
  } = useConditionForm(handleChange, formatInputSwitch)

  const onChangeAggregator = (selectedValue: any) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    setFieldValue('aggregatorId', selectedValue.value)
    setSelectedAggregator(selectedValue)
    setMessageRelationshipDupplicate('')
  }

  const onChangeMarketplace = (selectedValue: any) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    setFieldValue('marketplaceId', selectedValue.value)
    setSelectedMarketplace(selectedValue)
    setMessageRelationshipDupplicate('')
  }

  const onBlurAggregator = (e: any) => {
    setTouched({
      aggregatorId: true,
    })
    handleBlur(e.nativeEvent)
  }

  const onBlurMarketplace = (e: any) => {
    setTouched({
      marketplaceId: true,
    })
    handleBlur(e.nativeEvent)
  }

  useEffect(() => {
    new AggregatorService(axiosClient)
      .fetchAllAggregators(paginationAM, {
        search: '',
      })
      .then((response: any) => {
        setAggregators(transformToSelectData(response.data.content))
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    new MarketplaceService(axiosClient)
      .fetchAllMarketplaces(paginationAM, {
        search: '',
      })
      .then((response: any) => {
        setMarketplaces(transformToSelectData(response.data.content))
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useCommonAccesibility()

  useSwitchAccesibility(values)

  useCallbackPrompt(!isSubmitSuccess && dirty)

  return (
    <>
      <SeoConfig seoProperty={seoProperty.relationshipAMAdd}></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>{t('relationshipAM_add_title')}</h4>
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
                      htmlFor='aggregatorId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('aggregatorId'),
                      })}
                    >
                      {t('relationshipAM_details_aggregator')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='aggregatorId'
                      name='aggregatorId'
                      options={aggregators}
                      placeholder={t('relationshipAM_placeholder_aggregator')}
                      isSearchable
                      onChange={onChangeAggregator}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('aggregatorId'),
                      })}
                      value={selectedAggregator}
                      onBlur={onBlurAggregator}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('aggregatorId')}</Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('marketplaceId'),
                      })}
                    >
                      {t('relationshipAM_details_marketplace')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceId'
                      name='marketplaceId'
                      options={marketplaces}
                      placeholder={t('relationshipAM_placeholder_marketplace')}
                      isSearchable
                      onChange={onChangeMarketplace}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceId'),
                      })}
                      value={selectedMarketplace}
                      onBlur={onBlurMarketplace}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('marketplaceId')}</Row>
                <Row>{getFormErrorMessageDupplicateRelationship()}</Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('relationshipAM_details_status_active')}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='status'
                      checked={values.status === 'ACTIVE'}
                      onChange={onSwitchChange}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={() => navigate(ROUTE_RELATIONSHIP_AM.ROOT)}
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
