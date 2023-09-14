import {useEffect, useState, useContext, ChangeEvent} from 'react'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import {v4 as uuidv4} from 'uuid'
import _ from 'lodash'
import {Link, useParams, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {InputText} from 'primereact/inputtext'
import {InputSwitch, InputSwitchChangeParams} from 'primereact/inputswitch'
import {InputTextarea} from 'primereact/inputtextarea'
import {Card, Col, Container, Row, Tab, Nav, Button} from 'react-bootstrap'
import ProductService from '../../services/ProductService'
import {GlobalContext} from '../../store/GlobalContext'
import {ToastContext} from '../../providers/ToastProvider'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import {
  IProductDetail,
  IFormData,
  IUpdatePropertyDetailRequest,
  PropertyType,
  IProperty,
  IPropertyChild,
  IPropertyLocale,
  IPropertyGeneric,
} from '../../interface/products'
import {
  transformProductDetailDataToForm,
  transformInputData,
} from '../../helpers/transform'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {productTabItems as tabItems, PERMISSIONS, ROUTE_PRODUCT} from '../../constants'
import {StockLevelTable, ProductPriceTable, MarketplaceTable} from '../../components/Products'
import {
  useCommonAccesibility,
  useCallbackPrompt,
  usePersistLocationState,
  useHandleError,
  useGoBack,
  usePreviousPage
} from '../../hooks'
import {GenericInputField} from '../../components/GenericField'
import {IPropertyOption} from '../../interface/selectOption'
import {HyperDatepicker} from '../../components'

interface IFormError {
  name: string | null
  localeProperties: Array<{message: string | null; id: string | null}>
  genericProperties: Array<string | null>
}

interface IShowAddLocaleProperty {
  [locale: string]: boolean
}

interface IAddLocaleProperty {
  [locale: string]: IPropertyOption | null
}

interface ILocalePropertyValue {
  locale: string
  value: string | number | boolean
  propertyErpId: string
  type: PropertyType
  id: string
}

interface ILocalePropertyValueObj {
  [locale: string]: string | number | boolean
}

interface IShouldValidateLocaleProperty {
  [locale: string]: boolean | null
}

interface ILocalePropertyOption {
  [locale: string]: IPropertyOption[]
}

export default function ProductDetail() {
  const [tabName, setTabName] = useState<string>(tabItems[0].key)
  const {productId} = useParams<{productId: string}>()
  const {t} = useTranslation()
  const location = useLocation()
  const [productDetail, setProductDetail] = useState<IProductDetail | null>(
    null
  )
  const [selectPropertiesOption, setSelectPropertiesOption] = useState<
    IPropertyOption[]
  >([])
  const [filterSelectPropertiesOption, setFilterSelectPropertiesOption] =
    useState<IPropertyOption[]>([])
  const [selectLocalePropertiesOption, setSelectLocalePropertiesOption] =
    useState<IPropertyOption[]>([])
  const [selectLocalePropertiesOptions, setSelectLocalePropertiesOptions] =
    useState<ILocalePropertyOption>({})
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [selectedLocaleProperties, setSelectedLocaleProperties] =
    useState<IAddLocaleProperty>({})
  const [inputPropertyValue, setInputPropertyValue] = useState<string | number>(
    ''
  )

  const [localePropertyValues, setLocalePropertyValues] = useState<
    ILocalePropertyValue[]
  >([])
  const [inputSwitchPropertyValue, setInputSwitchPropertyValue] =
    useState<boolean>(true)
  const [isShowAddProperty, setIsShowAddProperty] = useState<boolean>(false)

  const [isShowAddLocaleProperties, setIsShowAddLocaleProperties] =
    useState<IShowAddLocaleProperty>({})
  const [isShouldSelectPropertyValidated, setIsShouldSelectPropertyValidated] =
    useState<boolean>(false)
  const [isPropertyFieldInvalid, setIsPropertyFieldInvalid] =
    useState<boolean>(false)
  const [localeValuesObj, setLocaleValuesObj] =
    useState<ILocalePropertyValueObj>({})

  const [localePropertyInvalid, setLocalePropertyInvalid] =
    useState<IShouldValidateLocaleProperty>({})
  const [localePropertyValueInvalid, setLocalePropertyValueInvalid] =
    useState<IShouldValidateLocaleProperty>({})
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [validErrors, setValidErrors] = useState<IFormError | null>(null)

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
      previousPage
    },
  } = useContext(GlobalContext)

  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const {state: persistState} = usePersistLocationState(location)

  const {goBackToViewListPage, goBackToPreviousPage} = useGoBack(
    persistState,
    ROUTE_PRODUCT.ROOT
  )

  const {
    setSubmitting,
    setValues,
    setTouched,
    values,
    handleSubmit,
    touched,
    dirty,
    resetForm,
    setFieldTouched,
    isSubmitting,
  } = useFormik<IFormData>({
    initialValues: {
      name: '',
      localeProperties: [],
      genericProperties: [],
    },
    onSubmit: () => {
      const requestData: IUpdatePropertyDetailRequest = {
        ...values,
        genericProperties: values.genericProperties.map((generic) =>
          generic.id.includes('test')
            ? {...generic, id: 0}
            : {...generic, localeName: ''}
        ),
      }
      productId &&
        new ProductService(axiosClient)
          .updateProductDetail(requestData, productId)
          .then((_response) => {
            setSubmitting(false)
            setIsSubmitSuccess(true)
            showGenericPropertiesSuccessUpdated()
          })
          .catch((err: any) => {
            setSubmitting(false)
            setIsSubmitSuccess(false)
            handleErrorResponse(err)
          })
    },
  })

  const handleGoBackViewListPage = () => {
    goBackToViewListPage()
  }

  const handleCancelEdit = () => {
    if (previousPage && !persistState) {
      goBackToPreviousPage()
    } else handleGoBackViewListPage()
  }

  const onSelectTab = (_event: any) => {
    setTabName(_event)
  }

  const handleApplyNewProperty = () => {
    productDetail &&
      setProductDetail({
        ...productDetail,
        propertyGenerics: [
          ...productDetail.propertyGenerics,
          {
            id: `test${(productDetail.propertyGenerics.length + 1).toString()}`,
            value: handleSetValueGenericType(selectedProperty.type),
            localeId: '',
            localeName: '',
            property: {
              id: null,
              erpId: selectedProperty.erpId,
              createdAt: null,
              modifiedAt: null,
              name: selectedProperty.label,
              version: null,
              status: null,
              localeSensitive: null,
              type: selectedProperty.type,
            },
          },
        ],
      })
  }

  const handleAddNewLocaleProperty = (locale: string) => {
    if (productDetail) {
      const propertyLocalesChildrenIndex =
        productDetail.propertyLocales.findIndex((x) => x.locale === locale)
      if (propertyLocalesChildrenIndex !== -1) {
        const propertyLocales = [...productDetail.propertyLocales]
        const propertyLocalesChildren: IPropertyChild[] = [
          ...propertyLocales[propertyLocalesChildrenIndex].propertyLocales,
          {
            id: '0',
            value: getLocalePropertyValue(locale),
            localeId: '',
            localeName: locale,
            property: {
              id: null,
              erpId: selectedLocaleProperties[locale]?.erpId || '',
              createdAt: null,
              modifiedAt: null,
              name: selectedLocaleProperties[locale]?.label || '',
              version: null,
              status: null,
              localeSensitive: null,
              type: selectedLocaleProperties[locale]?.type || 'Long string',
            },
          },
        ]

        propertyLocales.splice(propertyLocalesChildrenIndex, 1, {
          locale,
          propertyLocales: propertyLocalesChildren,
        })

        setProductDetail({
          ...productDetail,
          propertyLocales: propertyLocales,
        })
      }
    }
  }

  const handleSetValueGenericType = (type: PropertyType) => {
    switch (type) {
      case 'Boolean':
        return inputSwitchPropertyValue
      case 'Number':
        return Number(inputPropertyValue)
      case 'Long string':
        return inputPropertyValue
      case 'String':
        return inputPropertyValue
      default:
        return inputPropertyValue
    }
  }

  const handleAddPropertyValue = () => {
    setIsShowAddProperty(true)
    setSelectedProperty(null)
  }

  const handleAddLocaleProperty = (locale: string) => {
    setIsShowAddLocaleProperties({
      ...isShowAddLocaleProperties,
      [locale]: true,
    })

    const localeProperties = productDetail?.propertyLocales.find(
      (x) => x.locale === locale
    )
    const options = localeProperties?.propertyLocales.map(
      (x) =>
        ({
          erpId: x.property.erpId,
          label: x.property.name,
          type: x.property.type,
          value: x.value,
        } as IPropertyOption)
    )
    const filteredOptions = selectLocalePropertiesOption.filter(
      (x) => !options?.some((y) => y.erpId === x.erpId)
    )

    setSelectLocalePropertiesOptions({
      ...selectLocalePropertiesOptions,
      [locale]: filteredOptions || [],
    })

    setLocalePropertyValues([
      ...localePropertyValues,
      {
        value: '',
        propertyErpId: '',
        type: 'Long string',
        locale,
        id: locale,
      },
    ])

    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: null,
    })

    setLocalePropertyValueInvalid({
      ...localePropertyValueInvalid,
      [locale]: null,
    })

    if (selectedLocaleProperties[locale]) {
      setSelectedLocaleProperties({
        ...selectedLocaleProperties,
        [locale]: null,
      })
    }
  }

  const handleChangeSelectProperty = (e: any) => {
    setSelectedProperty(e)
    setInputPropertyValue(e.type === 'Date' ? new Date().toJSON() : '')
    setInputSwitchPropertyValue(true)
    setIsShouldSelectPropertyValidated(false)
  }

  const handleChangeSelectLocaleProperty = (e: any, locale: string) => {
    setSelectedLocaleProperties({
      ...selectedLocaleProperties,
      [locale]: e,
    })

    switch (e.type) {
      case 'Boolean':
        updateLocalePropertyValues(true, locale, e.erpId, e.type, true)
        break
      case 'Date':
        updateLocalePropertyValues(
          new Date().toJSON(),
          locale,
          e.erpId,
          e.type,
          true
        )
        break
      default:
        updateLocalePropertyValues('', locale, e.erpId, e.type, true)
    }
    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: false,
    })

    setLocalePropertyValueInvalid({
      ...localePropertyValueInvalid,
      [locale]: null,
    })
  }

  const handleChangeInputPropertyValue = (e: any, _selectedProperty: any) => {
    setIsShouldSelectPropertyValidated(false)
    if (_selectedProperty) {
      switch (_selectedProperty.type) {
        case 'String': {
          setInputPropertyValue(removeExtraSpace(e))
          break
        }
        case 'Long string': {
          setInputPropertyValue(removeExtraSpace(e))
          break
        }
        case 'Date': {
          setInputPropertyValue(e)
          break
        }
        case 'Number': {
          setInputPropertyValue(Number(e.target.value))
          break
        }
        default:
      }
    }
  }

  const checkStringValid = (
    value: string | number | boolean,
    locale: string
  ) => {
    if (
      ['Long string', 'String'].some(
        (x) => x === selectedLocaleProperties[locale]!.type
      )
    ) {
      value = value.toString().trim()
      return Boolean(value)
    }

    return true
  }

  const findLocalePropertyValueIndex = (locale: string) => {
    return localePropertyValues.findIndex((x) => x.id === locale)
  }

  const getLocalePropertyValue = (locale: string) => {
    const index = findLocalePropertyValueIndex(locale)
    if (index === -1) {
      return ''
    }

    return localePropertyValues[index].value
  }

  const updateLocalePropertyValues = (
    value: string | number | boolean,
    locale: string,
    propertyErpId?: string,
    type?: PropertyType,
    byPassCheckStringValid: boolean = false
  ) => {
    const index = findLocalePropertyValueIndex(locale)
    if (index !== -1) {
      const updatePropertyValue = {...localePropertyValues[index]}
      if (byPassCheckStringValid) {
        updatePropertyValue.value = value
      } else {
        updatePropertyValue.value = !checkStringValid(value, locale)
          ? ''
          : value
      }

      if (propertyErpId) {
        updatePropertyValue.propertyErpId = propertyErpId
      }

      if (type) {
        updatePropertyValue.type = type
      }
      localePropertyValues.splice(index, 1, updatePropertyValue)
      setLocalePropertyValues([...localePropertyValues])
    }
  }

  const removeLocalePropertyValues = (locale: string) => {
    const index = findLocalePropertyValueIndex(locale)
    if (index !== -1) {
      localePropertyValues.splice(index, 1)
      setLocalePropertyValues([...localePropertyValues])
    }
  }

  const handleChangeLocaleInputPropertyValue = (
    e: any,
    _selectedProperty: any,
    locale: string
  ) => {
    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: false,
    })
    if (_selectedProperty) {
      switch (_selectedProperty.type) {
        case 'Date':
          updateLocalePropertyValues(e, locale)
          setLocalePropertyValueInvalid({
            ...localePropertyValueInvalid,
            [locale]: !checkStringValid(e, locale),
          })
          break
        case 'String':
        case 'Long string': {
          updateLocalePropertyValues(e.target.value, locale)
          setLocalePropertyValueInvalid({
            ...localePropertyValueInvalid,
            [locale]: !checkStringValid(e.target.value, locale),
          })
          break
        }
        case 'Number': {
          updateLocalePropertyValues(Number(e.target.value), locale)
          setLocalePropertyValueInvalid({
            ...localePropertyValueInvalid,
            [locale]: !checkStringValid(Number(e.target.value), locale),
          })
          break
        }
        default:
      }
    }
  }

  const handleChangeInputSwitchValue = () => {
    setIsShouldSelectPropertyValidated(false)
    setInputSwitchPropertyValue(!inputSwitchPropertyValue)
  }

  const handleChangeLocaleInputSwitchValue = (locale: string) => {
    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: false,
    })

    setLocalePropertyValueInvalid({
      ...localePropertyValueInvalid,
      [locale]: null,
    })
    updateLocalePropertyValues(!Boolean(getLocalePropertyValue(locale)), locale)
  }

  const handleChangeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    productDetail &&
      setProductDetail({
        ...productDetail,
        name: e.target.value,
      })
  }

  const handleDetermineTransformInputDataValue = (
    e: ChangeEvent<HTMLInputElement> | Date | InputSwitchChangeParams,
    propGenericType: PropertyType
  ) => {
    if (propGenericType === 'Date') {
      return e
    }
    if (propGenericType === 'Boolean') {
      return (e as InputSwitchChangeParams).value
    } else return (e as ChangeEvent<HTMLInputElement>).target.value
  }

  const handleChangeGenericInputValue = (
    e: ChangeEvent<HTMLInputElement> | Date | InputSwitchChangeParams,
    propGenericId: string,
    propGenericType: PropertyType
  ) => {
    productDetail &&
      setProductDetail({
        ...productDetail,
        propertyGenerics: productDetail.propertyGenerics.map((propGeneric) =>
          propGeneric.id === propGenericId
            ? {
                ...propGeneric,
                value: transformInputData(
                  handleDetermineTransformInputDataValue(e, propGenericType),
                  propGenericType
                ),
              }
            : propGeneric
        ),
      })
  }

  const handleBlurProductName = () => {
    setTouched({})
    setFieldTouched('name')
    if (productDetail) {
      setProductDetail({
        ...productDetail,
        name: productDetail.name.trim(),
      })
    }
  }

  const handleBlurGenericInputValue = (
    _e: any,
    propGenericId: string,
    _propGenericType: PropertyType
  ) => {
    setTouched({
      name: false,
      localeProperties: values.localeProperties.map((_locale) => ({
        id: false,
        propertyErpId: false,
        value: false,
        type: false,
      })),
      genericProperties: values.genericProperties.map((generic) =>
        generic.id !== propGenericId
          ? {
              id: false,
              propertyErpId: false,
              value: false,
              type: false,
            }
          : {
              id: true,
              propertyErpId: true,
              value: true,
              type: true,
            }
      ),
    })
  }

  const handleHideAddProperty = () => {
    setIsShowAddProperty(false)
    setIsShouldSelectPropertyValidated(false)
    setInputPropertyValue('')
    setInputSwitchPropertyValue(true)
  }

  const handleHideAddLocaleProperty = (locale: string) => {
    setIsShowAddLocaleProperties({
      ...isShowAddLocaleProperties,
      [locale]: false,
    })
    removeLocalePropertyValues(locale)
    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: null,
    })

    setLocalePropertyValueInvalid({
      ...localePropertyValueInvalid,
      [locale]: null,
    })
  }

  const handleAddAndTriggerValidateNewProperty = () => {
    setIsShouldSelectPropertyValidated(true)
    if (selectedProperty) {
      if (selectedProperty.type !== 'Boolean') {
        if (!inputPropertyValue) return
        !!inputPropertyValue && handleApplyNewProperty()
      } else {
        handleApplyNewProperty()
      }
      handleHideAddProperty()
    }
  }

  const handleAddAndTriggerValidateNewLocaleProperty = (locale: string) => {
    setLocalePropertyInvalid({
      ...localePropertyInvalid,
      [locale]: true,
    })
    const index = localePropertyValues.findIndex((x) => x.id === locale)
    if (
      index === -1 ||
      (!localePropertyValues[index].value &&
        selectedLocaleProperties[locale]?.type !== 'Boolean')
    ) {
      setLocalePropertyValueInvalid({
        ...localePropertyValueInvalid,
        [locale]: true,
      })
      return
    }

    handleAddNewLocaleProperty(locale)
    handleHideAddLocaleProperty(locale)
  }

  const updateAddedLocaleProperty = (
    value: string | boolean | number,
    locale: string,
    id: string
  ) => {
    const localePropertiesIndex = productDetail?.propertyLocales.findIndex(
      (x) => x.locale === locale
    )
    const properties =
      productDetail?.propertyLocales[localePropertiesIndex!].propertyLocales
    const index = properties?.findIndex((x) => x.id === id)
    if (index === -1) {
      return
    }

    const updateProperty = {...properties![index!]}
    updateProperty.value = value
    properties?.splice(index!, 1, updateProperty)
    productDetail?.propertyLocales.splice(localePropertiesIndex!, 1, {
      ...productDetail?.propertyLocales[localePropertiesIndex!],
      propertyLocales: properties!,
    })

    setProductDetail({...productDetail!})
  }

  const handleChangeAddedInput = (e: any, locale: string, id: string) => {
    updateAddedLocaleProperty(e.target.value, locale, id)
  }

  const handleChangeAddedDateInput = (
    value: Date,
    locale: string,
    id: string
  ) => {
    updateAddedLocaleProperty(value.toJSON(), locale, id)
  }

  const handleBlurAddedInput = (id: string) => {
    setTouched({
      ...touched,
      localeProperties: values.localeProperties.map((x) => {
        return x.id !== id
          ? {
              id: false,
              propertyErpId: false,
              value: false,
              type: false,
            }
          : {
              id: true,
              propertyErpId: true,
              value: true,
              type: true,
            }
      }),
    })
  }

  const handleChangeAddedInputSwitch = (e: any, locale: string, id: string) => {
    updateAddedLocaleProperty(e.value, locale, id)
  }

  const handleCheckInvalidGenericField = (genericIndex: number) => {
    if (
      validErrors &&
      validErrors.genericProperties &&
      validErrors.genericProperties[genericIndex] &&
      touched.genericProperties &&
      touched.genericProperties[genericIndex].id === true
    )
      return true
    return false
  }

  const showGenericPropertiesSuccessUpdated = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const isFormErrorsExisted = (errorsForm: IFormError | null) => {
    if (errorsForm) {
      if (
        !!errorsForm.name ||
        errorsForm.genericProperties.find((generic) => !!generic) ||
        errorsForm.localeProperties.find((locale) => !!locale.message)
      ) {
        return true
      }
    }
    return false
  }

  const handleSubmitForm = () => {
    const touchedPropObj = {
      id: true,
      propertyErpId: true,
      value: true,
      type: true,
    }
    setTouched({
      name: true,
      genericProperties: values.genericProperties.map((_generic) => ({
        ...touchedPropObj,
      })),
      localeProperties: values.localeProperties.map((_locale) => ({
        ...touchedPropObj,
      })),
    })
    if (isFormErrorsExisted(validErrors)) return
    handleSubmit()
  }

  const transformPropertyOptions = (response: any) => {
    const propertyOptions = response.data.map(
      (it: IProperty) =>
        ({
          label: it.name,
          value: it.id,
          type: it.type,
          erpId: it.erpId,
        } as IPropertyOption)
    )

    return propertyOptions
  }

  const getError = (id: string) => {
    if (!validErrors) return null
    if (Array.isArray(validErrors.localeProperties)) {
      const error = [...validErrors.localeProperties].find((x) => x.id === id)
      return error?.message || null
    }
    return null
  }

  const handleResponsePropGeneric = (propGeneric: IPropertyGeneric) => {
    if (propGeneric.property.type === 'Number') {
      return {
        ...propGeneric,
        value: Number(propGeneric.value),
      }
    }
    if (propGeneric.property.type === 'Boolean') {
      return {
        ...propGeneric,
        value: propGeneric.value === 'true' ? true : false,
      }
    } else return propGeneric
  }

  const handleResponsePropLocale = (propLocale: IPropertyChild) => {
    if (propLocale.property.type === 'Number') {
      return Number(propLocale.value)
    }
    if (propLocale.property.type === 'Boolean') {
      return propLocale.value === 'true'
    } else return propLocale.value
  }

  const checkPropLocaleChildType = (propLocaleChild: IPropertyChild) =>
    propLocaleChild.property.type === 'Number' ? 'number' : 'text'

  const checkValidPropLocaleChild = (propLocaleChild: IPropertyChild) => {
    if (tabName === 'product_detail_tab_locale_properties') {
      return Boolean(getError(propLocaleChild.id))
    } else return false
  }
  const removeExtraSpace = (e: any) => {
    if (e.target.value === ' ') {
      setIsPropertyFieldInvalid(true)
      return e.target.value.trim()
    }
    return e.target.value
  }
  const renderGenericPropertiesTabPane = () => {
    if (productDetail && values) {
      return values.genericProperties.map((propGeneric, idx) => (
        <div key={propGeneric.id}>
          <Row>
            <Container fluid className='px-0'>
              <Row className='align-items-center py-1 m-0'>
                <Col xs={4}>
                  <label
                    htmlFor={
                      productDetail.propertyGenerics[idx].property.name ||
                      undefined
                    }
                  >
                    {productDetail.propertyGenerics[idx].property.name}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  {
                    <GenericInputField
                      type={propGeneric.type}
                      value={propGeneric.value}
                      cbInList={(e) =>
                        handleChangeGenericInputValue(
                          e,
                          propGeneric.id,
                          propGeneric.type
                        )
                      }
                      cbBlurInList={handleBlurGenericInputValue}
                      positionIn='list'
                      itemId={propGeneric.id}
                      isFieldInvalid={handleCheckInvalidGenericField(idx)}
                    />
                  }
                </Col>
              </Row>
            </Container>
          </Row>
        </div>
      ))
    } else return null
  }

  const renderAddPropertyButton = () => {
    return (
      <div className='d-flex justify-content-end'>
        <Button onClick={handleAddPropertyValue} type='button' variant='info'>
          <i className='pi pi-plus'></i>{' '}
          <span>{t('product_detail_tab_generic_properties_add_label')}</span>
        </Button>
      </div>
    )
  }
  const renderSelectPropertySection = () => {
    return (
      <Row className='align-items-center py-1 m-0'>
        <Col xs={4} className='px-0'>
          <Select
            id={`property-${uuidv4()}`}
            name='property'
            options={filterSelectPropertiesOption}
            placeholder={t(
              'product_detail_tab_generic_properties_select_placeholder'
            )}
            isSearchable
            onChange={handleChangeSelectProperty}
            className={classNames('react-select inherit-color', {
              'invalid-field':
                isShouldSelectPropertyValidated && _.isEmpty(selectedProperty),
            })}
            value={selectedProperty}
            classNamePrefix='react-select'
            isDisabled={_.isEmpty(selectPropertiesOption) ? true : undefined}
          />
        </Col>
        <Col xs={8} className='p-fluid'>
          <div className='d-flex'>
            <Col xl={10} lg={8} sm={6}>
              {
                <GenericInputField
                  isDisabled={_.isEmpty(selectedProperty)}
                  positionIn='single'
                  value={
                    selectedProperty && selectedProperty.type === 'Boolean'
                      ? inputSwitchPropertyValue
                      : inputPropertyValue
                  }
                  type={selectedProperty ? selectedProperty.type : 'text'}
                  cbInSingle={
                    selectedProperty && selectedProperty.type === 'Boolean'
                      ? handleChangeInputSwitchValue
                      : handleChangeInputPropertyValue
                  }
                  selectedProp={selectedProperty}
                  isFieldInvalid={isPropertyFieldInvalid}
                />
              }
            </Col>
            <Col xl={2} lg={4} sm={6}>
              <div className='d-flex justify-content-end align-items-center h-100'>
                <i
                  className='dripicons-cross d-flex align-items-center'
                  onClick={handleHideAddProperty}
                ></i>
                <i
                  className='dripicons-checkmark d-flex align-items-center ms-4'
                  onClick={handleAddAndTriggerValidateNewProperty}
                ></i>
              </div>
            </Col>
          </div>
        </Col>
      </Row>
    )
  }

  const renderPropertySection = () => {
    if (!isShowAddProperty) {
      return renderAddPropertyButton()
    } else return renderSelectPropertySection()
  }

  const renderPropertiesLocaleChild = (
    propLocale: IPropertyLocale,
    propLocaleChild: IPropertyChild
  ) => {
    if (propLocaleChild.property.type === 'Boolean') {
      return (
        <InputSwitch
          checked={Boolean(propLocaleChild.value)}
          onChange={(e) =>
            handleChangeAddedInputSwitch(
              e,
              propLocale.locale,
              propLocaleChild.id
            )
          }
        />
      )
    }
    if (propLocaleChild.property.type === 'Date') {
      return (
        <HyperDatepicker
          dateFormat={'dd/MM/yyyy'}
          value={new Date(propLocaleChild.value.toString())}
          onChange={(date: Date) =>
            handleChangeAddedDateInput(
              date,
              propLocale.locale,
              propLocaleChild.id
            )
          }
        />
      )
    }
    if (propLocaleChild.property.type === 'Long string') {
      return (
        <InputTextarea
          value={propLocaleChild.value.toString()}
          className={classNames('w-full p-1', {
            'p-invalid': checkValidPropLocaleChild(propLocaleChild),
          })}
          onChange={(e) =>
            handleChangeAddedInput(e, propLocale.locale, propLocaleChild.id)
          }
          onBlur={() => handleBlurAddedInput(propLocaleChild.id)}
        />
      )
    } else
      return (
        <InputText
          value={propLocaleChild.value.toString()}
          type={checkPropLocaleChildType(propLocaleChild)}
          className={classNames('w-full p-1', {
            'p-invalid': checkValidPropLocaleChild(propLocaleChild),
          })}
          onChange={(e) =>
            handleChangeAddedInput(e, propLocale.locale, propLocaleChild.id)
          }
          onBlur={() => handleBlurAddedInput(propLocaleChild.id)}
          min={0}
        />
      )
  }

  const renderPropertiesLocaleTabPane = (propLocale: IPropertyLocale) =>
    propLocale.propertyLocales.map((propLocaleChild) => {
      return (
        <Row key={propLocaleChild.property.name}>
          <Container fluid className='px-0'>
            <Row className='align-items-center py-1 m-0'>
              <Col xs={4}>
                <label htmlFor={propLocaleChild.property.name || undefined}>
                  {_.startCase(propLocaleChild.property.name || undefined)}
                </label>
              </Col>
              <Col xs={8} className='p-fluid'>
                {renderPropertiesLocaleChild(propLocale, propLocaleChild)}
              </Col>
            </Row>
          </Container>
        </Row>
      )
    })

  const renderAddPropertyLocaleButton = (propLocale: IPropertyLocale) => {
    return (
      <div className='d-flex justify-content-end'>
        <Button
          onClick={() => handleAddLocaleProperty(propLocale.locale)}
          type='button'
          variant='info'
        >
          <i className='pi pi-plus'></i>{' '}
          <span>{t('product_detail_tab_locale_properties_add_label')}</span>
        </Button>
      </div>
    )
  }

  const renderSelectLocalePropertySection = (propLocale: IPropertyLocale) => {
    return (
      <Row className='align-items-center py-1 m-0'>
        <Col xs={4} className='px-0'>
          <Select
            id='property'
            name='property'
            options={selectLocalePropertiesOptions[propLocale.locale]}
            placeholder={t(
              'product_detail_tab_locale_properties_select_placeholder'
            )}
            isSearchable
            onChange={(newValue) =>
              handleChangeSelectLocaleProperty(newValue, propLocale.locale)
            }
            className={classNames('react-select inherit-color', {
              'invalid-field':
                localePropertyInvalid[propLocale.locale] === true &&
                _.isEmpty(selectedLocaleProperties[propLocale.locale]),
            })}
            value={selectedLocaleProperties[propLocale.locale]}
            classNamePrefix='react-select'
            isDisabled={_.isEmpty(selectLocalePropertiesOption)}
          />
        </Col>
        <Col xs={8} className='p-fluid'>
          <div className='d-flex'>
            <Col xl={10} lg={8} sm={6}>
              {
                <GenericInputField
                  isDisabled={_.isEmpty(
                    selectedLocaleProperties[propLocale.locale]
                  )}
                  positionIn='single'
                  value={localeValuesObj[propLocale.locale]}
                  type={
                    selectedLocaleProperties[propLocale.locale]?.type ||
                    'Long string'
                  }
                  cbInSingle={
                    selectedLocaleProperties[propLocale.locale] &&
                    selectedLocaleProperties[propLocale.locale]?.type ===
                      'Boolean'
                      ? () =>
                          handleChangeLocaleInputSwitchValue(propLocale.locale)
                      : (e, _selectedProperty) =>
                          handleChangeLocaleInputPropertyValue(
                            e,
                            _selectedProperty,
                            propLocale.locale
                          )
                  }
                  selectedProp={selectedLocaleProperties[propLocale.locale]}
                  isFieldInvalid={
                    localePropertyValueInvalid[propLocale.locale]!
                  }
                />
              }
            </Col>
            <Col xl={2} lg={4} sm={6}>
              <div className='d-flex justify-content-end align-items-center h-100'>
                <i
                  className='dripicons-cross d-flex align-items-center'
                  onClick={() => handleHideAddLocaleProperty(propLocale.locale)}
                ></i>
                <i
                  className='dripicons-checkmark d-flex align-items-center ms-4'
                  onClick={() =>
                    handleAddAndTriggerValidateNewLocaleProperty(
                      propLocale.locale
                    )
                  }
                ></i>
              </div>
            </Col>
          </div>
        </Col>
      </Row>
    )
  }

  const renderLocalePropertySection = (propLocale: IPropertyLocale) => {
    if (!isShowAddLocaleProperties[propLocale.locale]) {
      return renderAddPropertyLocaleButton(propLocale)
    } else return renderSelectLocalePropertySection(propLocale)
  }

  const handleValidateGenericProperty = (newValidErrors: IFormError) => {
    values.genericProperties.forEach((generic, idx) => {
      if (generic.value === '') {
        newValidErrors.genericProperties[idx] = t('form_validate_required')
      }

      if (typeof generic.value === 'number' && generic.value < 0) {
        newValidErrors.genericProperties[idx] = t(
          'form_validate_positive_number'
        )
      }
    })
  }

  const handleValidateLocaleProperty = (newValidErrors: IFormError) => {
    values.localeProperties.forEach((locale, idx) => {
      if (locale.value === '') {
        newValidErrors.localeProperties[idx] = {
          id: locale.id,
          message: t('form_validate_required'),
        }
      }

      if (typeof locale.value === 'number' && locale.value < 0) {
        newValidErrors.localeProperties[idx] = {
          id: locale.id,
          message: t('form_validate_positive_number'),
        }
      }
    })
  }

  useEffect(() => {
    if (localePropertyValues.length > 0) {
      const hashTable: ILocalePropertyValueObj = {}
      for (const obj of localePropertyValues) {
        hashTable[obj.locale] = obj.value
      }
      setLocaleValuesObj(hashTable)
    }
  }, [localePropertyValues])

  useEffect(() => {
    productId &&
      new ProductService(axiosClient)
        .getProductById(productId)
        .then((response) => {
          const propertyLocalesSortedByChildName =
            response.data.propertyLocales.map((propLocale) => {
              return {
                locale: propLocale.locale,
                propertyLocales: _.sortBy(
                  propLocale.propertyLocales,
                  (propLocaleChild) =>
                    propLocaleChild.property.name?.toLowerCase()
                ).map((x) => ({...x, localeName: propLocale.locale, value: handleResponsePropLocale(x)})),
              }
            })
          const propertyLocalesSortedByLocale = _.sortBy(
            propertyLocalesSortedByChildName,
            (l) => l.locale
          )
          const productDetailsData = {
            ...response.data,
            propertyLocales: propertyLocalesSortedByLocale,
            propertyGenerics: response.data.propertyGenerics.map(
              (propGeneric) => handleResponsePropGeneric(propGeneric)
            ),
          }
          const showAddLocaleProperties: IShowAddLocaleProperty = {}
          const localeProperties: IAddLocaleProperty = {}
          propertyLocalesSortedByLocale.forEach((x) => {
            showAddLocaleProperties[x.locale] = false
            localeProperties[x.locale] = null
          })
          setIsShowAddLocaleProperties(showAddLocaleProperties)
          setSelectedLocaleProperties(localeProperties)
          setProductDetail(productDetailsData)
          resetForm({
            values: transformProductDetailDataToForm(productDetailsData),
          })
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }, [productId])

  useEffect(() => {
    if (productDetail) {
      setValues(transformProductDetailDataToForm(productDetail)) 
    }
  }, [productDetail])

  useEffect(() => {
    if (!_.isEmpty(productDetail) && !_.isEmpty(selectPropertiesOption)) {
      setFilterSelectPropertiesOption(
        selectPropertiesOption.filter(
          (item) =>
            !productDetail.propertyGenerics
              .map((propGeneric) => propGeneric.property.erpId)
              .includes(item.erpId)
        )
      )
    }
  }, [productDetail, selectPropertiesOption])

  useEffect(() => {
    new ProductPropertiesService(axiosClient)
      .getGenericProperties()
      .then((response: any) => {
        if (response && response.data) {
          const propertyOptions = transformPropertyOptions(response)
          setSelectPropertiesOption(propertyOptions)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })

    new ProductPropertiesService(axiosClient)
      .getLocaleProperties()
      .then((response: any) => {
        if (response && response.data) {
          const propertyOptions = transformPropertyOptions(response)
          setSelectLocalePropertiesOption(propertyOptions)
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (
      !isShouldSelectPropertyValidated ||
      (selectedProperty && selectedProperty.type === 'Boolean')
    ) {
      setIsPropertyFieldInvalid(false)
      return
    }

    if (
      !selectedProperty ||
      (selectedProperty &&
        selectedProperty.type !== 'Boolean' &&
        !inputPropertyValue)
    ) {
      setIsPropertyFieldInvalid(true)
    }
  }, [isShouldSelectPropertyValidated])

  useEffect(() => {
    document.querySelectorAll('.p-inputtext').forEach((el) => {
      el.setAttribute('aria-label', 'input-text')
    })
    document.querySelectorAll('[role="combobox"]').forEach((el) => {
      el.setAttribute('aria-label', 'combobox')
    })
  }, [
    tabName,
    document.querySelectorAll('.p-inputtext'),
    document.querySelectorAll('[role="combobox"]').forEach((el) => {
      el.setAttribute('aria-label', 'combobox')
    }),
  ])

  useEffect(() => {
    document.querySelectorAll('input[type="text"]').forEach((el) => {
      el.setAttribute('aria-label', 'input-text')
    })
  }, [document.querySelectorAll('input[type="text"]')])

  useEffect(() => {
    document.querySelectorAll('div[role="checkbox"]').forEach((el) => {
      // el.setAttribute('aria-label', 'checkbox')
      el.setAttribute('aria-hidden', 'true')
    })
  }, [document.querySelectorAll('div[role="checkbox"]')])

  useEffect(() => {
    document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      el.setAttribute('aria-label', 'checkbox')
      el.setAttribute('tabindex', '-1')
    })
  }, [document.querySelectorAll('input[type="checkbox"]')])

  useEffect(() => {
    isSubmitSuccess && handleGoBackViewListPage()
  }, [isSubmitSuccess])

  useCallbackPrompt(!isSubmitSuccess && dirty, persistState)

  useCommonAccesibility()

  useEffect(() => {
    isShowAddProperty &&
      document.querySelectorAll('input[type=text]').forEach((el) => {
        el.setAttribute('aria-label', 'textbox')
      })
  }, [isShowAddProperty])

  useEffect(() => {
    if (values) {
      const newValidErrors: IFormError = {
        name: null,
        localeProperties: values.localeProperties.map(() => ({
          id: null,
          message: null,
        })),
        genericProperties: values.genericProperties.map(() => null),
      }
      if (!values.name) {
        newValidErrors.name = t('form_validate_required')
      }

      handleValidateGenericProperty(newValidErrors)
      handleValidateLocaleProperty(newValidErrors)

      setValidErrors(newValidErrors)
    }
  }, [values])

  usePreviousPage('apps-product-detail', {productId})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.productDetail}></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>{t('product_detail_title')}</h4>
        </Card.Header>
        <Card.Body>
          <form
            className='form-layout'
            onSubmit={handleSubmitForm}
            autoComplete='on'
          >
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='organizationErpId'>
                      {t('product_detail_organizationErpId')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='organizationErpId'
                      name='organizationErpId'
                      value={productDetail?.organizationErpId || ''}
                      className='w-full p-1'
                      disabled
                    />
                  </Col>
                </Row>
              </Container>
            </Row>

            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='organizationName'>
                      {t('product_detail_organizationName')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='organizationName'
                      name='organizationName'
                      value={productDetail?.organizationName || ''}
                      className='w-full p-1'
                      disabled
                    />
                  </Col>
                </Row>
              </Container>
            </Row>

            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='id'>{t('product_detail_productId')}</label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='id'
                      name='id'
                      value={productDetail?.id || ''}
                      className='w-full p-1'
                      disabled
                    />
                  </Col>
                </Row>
              </Container>
            </Row>

            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='erpId'>
                      {t('product_detail_productErpId')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='erpId'
                      name='erpId'
                      value={productDetail?.erpId || ''}
                      className='w-full p-1'
                      disabled
                    />
                  </Col>
                </Row>
              </Container>
            </Row>

            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='name' className='required'>
                      {t('product_detail_productName')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='name'
                      name='name'
                      value={productDetail?.name || ''}
                      onChange={handleChangeProductName}
                      onBlur={handleBlurProductName}
                      className={classNames('w-full p-1', {
                        'p-invalid': !productDetail?.name && touched.name,
                      })}
                      maxLength={255}
                    />
                  </Col>
                </Row>
              </Container>
            </Row>

            <Row className='mt-4'>
              <Container fluid>
                <Tab.Container
                  defaultActiveKey='product_detail_tab_generic_properties'
                  onSelect={onSelectTab}
                  activeKey={tabName}
                  mountOnEnter
                >
                  <Nav variant='pills' justify className='bg-nav-pills'>
                    {tabItems.map((tabItem) => (
                      <Nav.Item key={tabItem.key}>
                        <Nav.Link as={Link} to='#' eventKey={tabItem.key}>
                          <i className='d-md-none d-block me-1'></i>
                          <span className='d-none d-md-block'>
                            {t(tabItem.label)}
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane
                      eventKey='product_detail_tab_generic_properties'
                      id='product_detail_tab_generic_properties'
                    >
                      {renderGenericPropertiesTabPane()}
                      <br />
                      {renderPropertySection()}
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey='product_detail_tab_locale_properties'
                      id='product_detail_tab_locale_properties'
                    >
                      {productDetail &&
                        productDetail.propertyLocales.map((propLocale) => {
                          return (
                            <div key={propLocale.locale}>
                              <h3 className='mt-4 mb-2'>{propLocale.locale}</h3>
                              {renderPropertiesLocaleTabPane(propLocale)}
                              {renderLocalePropertySection(propLocale)}
                            </div>
                          )
                        })}
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey='product_detail_tab_stockLevel'
                      id='product_detail_tab_stockLevel'
                    >
                      <Row>
                        <Col sm='12'>
                          <StockLevelTable productId={productId} />
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey='product_detail_tab_price'
                      id='product_detail_tab_price'
                    >
                      <Row>
                        <Col sm='12'>
                          <ProductPriceTable productId={productId} />
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey='product_detail_tab_marketplace'
                      id='product_detail_tab_marketplace'
                    >
                      <Row>
                        <Col sm='12'>
                          <MarketplaceTable productId={productId} />
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Container>
            </Row>

            <Row className='mt-4'>
              <Col>
                <div className='d-flex justify-content-between'>
                  <Button
                    className='me-2'
                    variant='danger'
                    onClick={handleCancelEdit}
                  >
                    {t('common_confirm_cancel')}
                  </Button>
                  <Button
                    className='me-2'
                    variant='success'
                    onClick={handleSubmitForm}
                    disabled={
                      isSubmitting ||
                      (dirty && isFormErrorsExisted(validErrors)) ||
                      !dirty ||
                      (
                        Boolean(productId) && 
                          (checkHasPermissions &&
                          !checkHasPermissions([PERMISSIONS.edit_product_details]))
                      )
                    }
                  >
                    {t('common_confirm_save')}
                  </Button>
                </div>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}
