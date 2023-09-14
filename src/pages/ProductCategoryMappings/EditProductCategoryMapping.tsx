import {
  useState,
  useEffect,
  useContext,
  useRef,
  SetStateAction,
  FocusEvent,
} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {Card, Col, Container, Row, Button} from 'react-bootstrap'
import Select, {MultiValue, SingleValue, ActionMeta} from 'react-select'
import {useTranslation} from 'react-i18next'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {useFormik} from 'formik'
import classNames from 'classnames'
import _ from 'lodash'
import {
  useCallbackPrompt,
  usePersistLocationState,
  useCommonAccesibility,
  useHandleError,
  useGoBack
} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import ProductCategoryMappingsService from '../../services/ProductCategoryMappingsService'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import MappingService from '../../services/MappingService'
import {GlobalContext} from '../../store/GlobalContext'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {
  transformMarketplaceProductCategoriesOptionToSelectData,
  transformMarketplaceTypeFormDataSingleElement,
  transformProductCategoryFormData,
  transformProductCategoryDetailToSelectData,
} from '../../helpers'
import {
  IUpdateProductCategoriesMapping,
  IUpdateProductCategoriesMappingForm,
  ISelectOption,
  IUpdateCategoryMappingTableList,
  ISelectProductCategoryMapping,
  IUpdateCategoryMappingTableRow,
  ICurrentSelectProperty
} from '../../interface'
import {ToastContext} from '../../providers'
import {PERMISSIONS, ROUTE_PRODUCT_CATEGORY_MAPPINGS} from '../../constants'
import {defaultTablePaginationSortByErpIdPerPage} from '../../constants/pagination'

export default function EditProductCategoryMapping() {
  const {t} = useTranslation()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const {productCategoryMappingsId} = useParams()

  const [categoryMappingsTableList, setCategoryMappingsTableList] =
    useState<IUpdateCategoryMappingTableList>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [mmsValueResponse, setMMSValueResponse] = useState<string>('')
  const [mappingTypeIdResponse, setMappingTypeIdResponse] = useState<string>('')
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ISelectOption | null>(null)
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(null)
  const [
    marketplaceProductCategoryOptions,
    setMarketplaceProductCategoryOptions,
  ] = useState<Array<ISelectProductCategoryMapping>>([])
  const [mmsProductCategoryOptions, setMMSProductCategoryOptions] = useState<
    any[]
  >([])
  const [
    selectedMarketplaceProductCategories,
    setSelectedMarketplaceProductCategories,
  ] = useState<Array<ISelectProductCategoryMapping>>([])
  const [splitPropertiesOption, setSplitPropertiesOption] = useState<
    {label: string, value: string, erpId: string}[]
  >([])
  const [listOptionValuesWithId, setListOptionValuesWithId] = useState<any[]>([])
  const [splitPropertyInfos, setSplitPropertyInfos] = useState<{id: string, splitProperty: string}[]>([])
  const [currentSelectPropertyInfo, setCurrentSelectPropertyInfo] =
    useState<ICurrentSelectProperty | null>(null)
  const [isShouldPreventCancelEditForm, setIsShouldPreventCancelEditForm] = useState<boolean>(false)
  const [isShouldNavigateBackToListPage, setIsShouldNavigateBackToListPage] = useState<boolean>(false)
  const [countUpdateForm, setCountUpdateForm] = useState<number>(0)

  const {
    state: {
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {toast} = useContext(ToastContext)

  const {goBackToViewListPage} = useGoBack(persistState, ROUTE_PRODUCT_CATEGORY_MAPPINGS.ROOT)

  const initialValueFormRef = useRef<IUpdateProductCategoriesMappingForm>({
    version: 0,
    marketplaceTypeId: '',
    mmsValue: '',
    mappingTypeId: '',
    productPropertyValues: [],
  })
  const marketplaceProductCategoriesRef =
    useRef<ISelectProductCategoryMapping[]>()

  const getAllProductProperties = async () => {
    try {
      const productPropertiesResponse = await new ProductPropertiesService(
        axiosClient
      ).getProductProperties(
        {
          ...defaultTablePaginationSortByErpIdPerPage,
          rows: 2000
        },
        {
          search: '',
        }
      )
      setSplitPropertiesOption(
        productPropertiesResponse.data.content.map((item: any) => ({
          label: item.name,
          value: item.id,
          erpId: item.erpId
        }))
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const getProductCategoriesMappingDetail = async (_productCategoryMappingsId: string) => {
    try {
      const productCategoryMappingResponse =
        await new ProductCategoryMappingsService(
          axiosClient
        ).getProductCategoryMapping(_productCategoryMappingsId)
      const {mmsValue, marketplaceType, mappingType} =
        productCategoryMappingResponse.data
      setMMSValueResponse(mmsValue)
      setMappingTypeIdResponse(mappingType.id)
      setSelectedMarketplaceType(
        transformMarketplaceTypeFormDataSingleElement(marketplaceType)
      )
      setSelectedMarketplaceProductCategories(
        transformProductCategoryDetailToSelectData(
          productCategoryMappingResponse.data
        )
      )
      marketplaceProductCategoriesRef.current =
        transformProductCategoryDetailToSelectData(
          productCategoryMappingResponse.data
        )
      initialValueFormRef.current = {
        ...initialValueFormRef.current,
        mmsValue,
        marketplaceTypeId: marketplaceType.id,
        mappingTypeId: mappingType.id,
      }
      resetForm({
        values: {
          ...values,
          mmsValue,
          marketplaceTypeId: marketplaceType.id,
          mappingTypeId: mappingType.id,
        },
      })
    } catch (err: any) {
      handleErrorResponse(err,)
    }
  }

  const getMMSProductCategoryOptions = async () => {
    try {
      const mmsProductCategoryResponse =
        await new ProductCategoryMappingsService(
          axiosClient
        ).getProductCategory()
      setMMSProductCategoryOptions(
        transformProductCategoryFormData(mmsProductCategoryResponse.data)
      )
    } catch (err: any) {
      handleErrorResponse(err,)
    }
  }

  const getMarketplaceProductCategoryOptions = async (
    _marketplaceTypeId: string
  ) => {
    try {
      const marketplaceProductCategoryResponse = await new MappingService(
        axiosClient
      ).getMappingTargetInProductCategory(_marketplaceTypeId)
      setMarketplaceProductCategoryOptions(
        transformMarketplaceProductCategoriesOptionToSelectData(
          marketplaceProductCategoryResponse.data
        )
      )
    } catch (err: any) {
      handleErrorResponse(err,)
    }
  }

  const handleChangeMarketplaceProductCategories = (
    _selectedMarketplaceProductCategories: MultiValue<ISelectProductCategoryMapping>
  ) => {
    setCountUpdateForm(countUpdateForm + 1)
    setTouched({}, false)
    if (_selectedMarketplaceProductCategories.length === 0) {
      setSelectedMarketplaceProductCategories([])
    }
      if (_selectedMarketplaceProductCategories.length > 1) {
        const combineSelectedMarketplaceProductCategories =
          _selectedMarketplaceProductCategories.map((item) => {
              const findRefProductCategoryById =
                marketplaceProductCategoriesRef.current?.find(
                  (el) => el.value === item.value
                )
              const findProductValueById = values.productPropertyValues.find(p => p.id === item.value)
              if (findRefProductCategoryById) {
                return {
                  ...item,
                  splitProperty: findRefProductCategoryById.splitProperty,
                  splitValue: findRefProductCategoryById.splitValue,
                  splitPropertyName: findRefProductCategoryById.splitPropertyName,
                  propertyValuesOption: findRefProductCategoryById.propertyValuesOption
                }
              }

              if (findProductValueById) {
                return {
                  ...item,
                  splitProperty: findProductValueById.splitProperty,
                  splitValue: findProductValueById.splitValue,
                  splitPropertyName: findProductValueById.splitPropertyName,
                  propertyValuesOption: findProductValueById.propertyValuesOption
                }
              }

              return item
          })

      setSelectedMarketplaceProductCategories(
        combineSelectedMarketplaceProductCategories as SetStateAction<
          ISelectProductCategoryMapping[]
        >
      )
    }
    if (_selectedMarketplaceProductCategories.length === 1) {
      setSelectedMarketplaceProductCategories([
        {
          ..._selectedMarketplaceProductCategories[0],
          splitProperty: null,
          splitValue: null,
        },
      ] as SetStateAction<ISelectProductCategoryMapping[]>)
    }
  }

  const handleChangeSplitProperty = (
    _selectedSplitProperty: SingleValue<any>,
    action: ActionMeta<any>
  ) => {
    setCountUpdateForm(countUpdateForm + 1)
    if (!_selectedSplitProperty) return
    setCurrentSelectPropertyInfo({
      rowId: action.name,
      propertyId: _selectedSplitProperty.value,
    })
      setFieldValue(
        'productPropertyValues',
        values.productPropertyValues.map((item) =>
          item.id === action.name
            ? {
                ...item,
                splitProperty: _selectedSplitProperty.erpId,
                splitPropertyName: _selectedSplitProperty.label,
                splitValue: null,
              }
            : item
        )
      )      
  }

  const handleChangeSplitValue = (
    _selectedSplitValue: SingleValue<ISelectOption>,
    action: ActionMeta<ISelectOption>
  ) => {
    setCountUpdateForm(countUpdateForm + 1)
    _selectedSplitValue &&
      setFieldValue(
        'productPropertyValues',
        values.productPropertyValues.map((item) =>
          item.id === action.name
            ? {...item, splitValue: _selectedSplitValue.label}
            : item
        )
      )
  }

  const handleBlurSplitPropertyField = (
    _e: FocusEvent<HTMLInputElement> | undefined,
    _productPropertyId: string
  ) => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertyId
    )
    indexOfSpecifiedId !== -1 &&
      setFieldTouched(
        `productPropertyValues.${indexOfSpecifiedId}.splitProperty`,
        true
      )
  }

  const handleBlurSplitValueField = (
    _e: FocusEvent<HTMLInputElement> | undefined,
    _productPropertyId: string
  ) => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertyId
    )
    indexOfSpecifiedId !== -1 &&
      setFieldTouched(
        `productPropertyValues.${indexOfSpecifiedId}.splitValue`,
        true
      )
  }

  const detectSplitProperty: (
    _productPropertyId: string
  ) => ISelectOption | null = (_productPropertyId) => {
    const productPropertyFindById = values.productPropertyValues.find(
      (item) => item.id === _productPropertyId
    )

    if (productPropertyFindById) {
      return {
        label: productPropertyFindById.splitPropertyName,
        value: productPropertyFindById.splitProperty || '',
      }
    }
    return null
  }

  const detectSplitValue: (
    _productPropertyId: string
  ) => ISelectOption | null = (_productPropertyId) => {
    const productPropertyFindById = values.productPropertyValues.find(
      (item) => item.id === _productPropertyId
    )
    if (productPropertyFindById) {
      return {
        label: productPropertyFindById.splitValue || '',
        value: productPropertyFindById.splitValue || '',
      }
    }
    return null
  }

  const detectSplitValuesOption: (
    _productPropertiesId: string
  ) => ISelectOption[] = (_productPropertiesId: string) => {
    if (countUpdateForm > 0) {
      const productPropertyFindById = values.productPropertyValues.find(
        (item) => item.id === _productPropertiesId
      )
      if (productPropertyFindById) {
        return productPropertyFindById.propertyValuesOption
      }
      return []
    } else {
      const productFindInListOptions = listOptionValuesWithId.find((option: any) => option.id === _productPropertiesId)
      if (productFindInListOptions) {
        return productFindInListOptions.splitValueOption
      } else return []
    }
  }

  const showProductCategoryMappingSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('product_category_mapping_edit_success_message'),
      life: 5000,
    })
  }

  const showProductCategoryMappingFailEdited = () => {
    toast?.current.show({
      severity: 'error',
      summary: t('toast_fail_title'),
      detail: t('toast_fail_update_value_mapping'),
      life: 5000,
    })
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    dirty,
    values,
    resetForm,
    setFieldTouched,
    setTouched,
  } = useFormik<IUpdateProductCategoriesMappingForm>({
    initialValues: initialValueFormRef.current,
    onSubmit: (data) => {
      const requestData = {
        ...data,
        productPropertyValues: data.productPropertyValues.map((item) => ({
          ..._.omit(item, ['id']),
          splitProperty:
            splitPropertiesOption.find(
              (sp) =>
                sp.label === item.splitPropertyName ||
                sp.value === item.splitProperty
            )?.erpId || '',
          splitValue: item.splitValue,
        })),
      }
      setSubmitting(true)
      setIsShouldPreventCancelEditForm(true)
      productCategoryMappingsId &&
        new ProductCategoryMappingsService(axiosClient)
          .editProductCategoriesMapping(requestData)
          .then((_response) => {
            setSubmitting(false)
            showProductCategoryMappingSuccessEdited()
            setIsShouldNavigateBackToListPage(true)
          })
          .catch((err) => {
            setSubmitting(false)
            handleErrorResponse(err, showProductCategoryMappingFailEdited)
            setIsShouldPreventCancelEditForm(false)
          })
    },
    validate: (validateData: IUpdateProductCategoriesMappingForm) => {
      let validErrors: any = {}
      if (!validateData.mmsValue) {
        validErrors.mmsValue = t('form_validate_required')
      }
      if (!validateData.marketplaceTypeId) {
        validErrors.marketplaceTypeId = t('form_validate_required')
      }
      if (_.isEmpty(validateData.productPropertyValues)) {
        validErrors.productPropertyValues = t('form_validate_required')
      }
      if (
        validateData.productPropertyValues.length > 1 &&
        validateData.productPropertyValues.find(
          (item) => !item.splitProperty || !item.splitValue
        )
      ) {
        validErrors.productPropertyValues = t('form_validate_required')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IUpdateProductCategoriesMapping) => {
    return !!(touched[name] && errors[name])
  }

  const isMarketplaceProductCategoryFieldInvalid = (
    name: keyof IUpdateProductCategoriesMapping
  ) => {
    return touched[name] && _.isEmpty(values.productPropertyValues)
  }

  const isProductPropertieValuesFieldValid = (
    _productPropertyId: string,
    fieldName: 'splitProperty' | 'splitValue'
  ) => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertyId
    )
    if (
      indexOfSpecifiedId !== -1 &&
      touched &&
      touched.productPropertyValues &&
      !_.isEmpty(touched.productPropertyValues)
    ) {
      switch (fieldName) {
        case 'splitProperty':
          if (touched.productPropertyValues[indexOfSpecifiedId]) {
            return (
              touched.productPropertyValues[indexOfSpecifiedId].splitProperty &&
              !values.productPropertyValues[indexOfSpecifiedId].splitProperty
            )
          }
          return false

        case 'splitValue':
          if (touched.productPropertyValues[indexOfSpecifiedId]) {
            return (
              touched.productPropertyValues[indexOfSpecifiedId].splitValue &&
              !values.productPropertyValues[indexOfSpecifiedId].splitValue
            )
          }
          return false

        default:
      }
    }
  }

  const handleSelectEmptyMarketplaceProductProperty = () => {
    countUpdateForm > 0 && setFieldValue('productPropertyValues', [])
    if (countUpdateForm === 0) {
      resetForm({
        values: {
          ...values,
          productPropertyValues: [],
        },
      })
      initialValueFormRef.current = {
        ...initialValueFormRef.current,
        productPropertyValues: [],
      }
    }
    return
  }

  const handleSelectSingleMarketplaceProductProperty = () => {
    const productPropertyItem = {
      marketplaceValue: selectedMarketplaceProductCategories[0].label,
      marketplaceCode: selectedMarketplaceProductCategories[0].code || '',
      splitProperty:
        selectedMarketplaceProductCategories[0].splitProperty || null,
      splitValue: selectedMarketplaceProductCategories[0].splitValue || null,
      id: selectedMarketplaceProductCategories[0].value,
      splitPropertyName:
        selectedMarketplaceProductCategories[0].splitPropertyName || '',
      propertyValuesOption: selectedMarketplaceProductCategories[0].propertyValuesOption
    }
    if (countUpdateForm > 0) {
      setFieldValue('productPropertyValues', [productPropertyItem])
    }
    if (countUpdateForm === 0) {
      resetForm({
        values: {
          ...values,
          productPropertyValues: [productPropertyItem],
        },
      })
      initialValueFormRef.current = {
        ...initialValueFormRef.current,
        productPropertyValues: [productPropertyItem],
      }
    }
    return
  }

  const handleSelectMultiMarketplaceProductProperties = () => {
    const productCategoriesList = selectedMarketplaceProductCategories.map(
      (item) => {
        return {
          marketplaceValue: item.label,
          marketplaceCode: item.code || '',
          splitProperty: item.splitProperty,
          splitValue: item.splitValue,
          splitPropertyName: item.splitPropertyName || '',
          id: item.value,
          propertyValuesOption: item.propertyValuesOption
        }
      }
    )
    if (countUpdateForm > 0) {
      setFieldValue('productPropertyValues', productCategoriesList)
    }
    if (countUpdateForm === 0) {
      resetForm({
        values: {
          ...values,
          productPropertyValues: productCategoriesList,
        },
      })
      initialValueFormRef.current = {
        ...initialValueFormRef.current,
        productPropertyValues: productCategoriesList,
      }
    }
  }

  const handleCancel = () => {
    if (!isShouldPreventCancelEditForm) {
      goBackToViewListPage()
    }
  }

  const handleGetPropertyValueOptionByPropertyId = async () => {
    const listOptionValues: any = []
    for (const item of splitPropertyInfos) {
      const findItem = splitPropertiesOption.find(
        (spl) => spl.erpId === item.splitProperty
      )
      if (findItem) {
        try {
          const valueOptionsOfItem = await new ProductCategoryMappingsService(
            axiosClient
          ).getPropertyValuesByPropetyId(findItem.value)
          listOptionValues.push({
            id: item.id,
            splitValueOption: valueOptionsOfItem.data.map(
              (propertyValue: string) => ({
                label: propertyValue,
                value: propertyValue,
              })
            ),
          })
        } catch (err: any) {
          handleErrorResponse(err)
        }
      }
    }
    setListOptionValuesWithId(listOptionValues)
  }

  const updateFormValuesWithCurrentSelectProperty = async (
    currentSelectProperty: ICurrentSelectProperty
  ) => {
    if (!currentSelectProperty.rowId) return
    try {
      const propertyValuesResponse = await new ProductCategoryMappingsService(
        axiosClient
      ).getPropertyValuesByPropetyId(currentSelectProperty.propertyId)
      setFieldValue(
        'productPropertyValues',
        values.productPropertyValues.map((item) =>
          item.id === currentSelectProperty.rowId
            ? {
                ...item,
                propertyValuesOption: propertyValuesResponse.data.map(
                  (propertyValue: string) => ({
                    label: propertyValue,
                    value: propertyValue,
                  })
                ),
              }
            : item
        )
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const findItemWithIdInListOption = (item: any, type: 'value' | 'id') => {
    const findItem = listOptionValuesWithId.find(
      (list) => type === 'id' ? list.id === item.id : list.id === item.value)
    if (findItem) {
      return {...item, propertyValuesOption: findItem.splitValueOption}
    } else return item
  }

  useEffect(() => {
    countUpdateForm === 0 && values && setSplitPropertyInfos(
      values.productPropertyValues.map((item) => ({
        id: item.id,
        splitProperty: item.splitProperty || '',
      }))
    ) 
  }, [values])

  useEffect(() => {
    if (countUpdateForm === 0 && listOptionValuesWithId.length > 0) {
      resetForm({
        values: {
          ...values,
          productPropertyValues: values.productPropertyValues.map((item) =>
            findItemWithIdInListOption(item, 'id')
          ),
        },
      })
      setCountUpdateForm(countUpdateForm + 1)
      if (marketplaceProductCategoriesRef.current) {
        marketplaceProductCategoriesRef.current =
          marketplaceProductCategoriesRef.current.map((item) =>
            findItemWithIdInListOption(item, 'value')
          )
      }
    }
  }, [listOptionValuesWithId])

  useEffect(() => {
    if (currentSelectPropertyInfo) {
      updateFormValuesWithCurrentSelectProperty(currentSelectPropertyInfo)
    }
  }, [currentSelectPropertyInfo])

  useEffect(() => {
    if (countUpdateForm === 0) {
      handleGetPropertyValueOptionByPropertyId()
    }
  }, [splitPropertyInfos, splitPropertiesOption])

  useEffect(() => {
    getAllProductProperties()
  }, [])

  useEffect(() => {
    getMMSProductCategoryOptions()
  }, [])

  useEffect(() => {
    productCategoryMappingsId &&
      getProductCategoriesMappingDetail(productCategoryMappingsId)
  }, [productCategoryMappingsId])

  useEffect(() => {
    const mmsProductCategoryFindByValue = mmsProductCategoryOptions.find(
      (item: any) => item.label === mmsValueResponse
    )
    setSelectedProductCategory({
      label: mmsValueResponse,
      value: mmsProductCategoryFindByValue?.value || '',
    })
  }, [mmsProductCategoryOptions, mmsValueResponse])

  useEffect(() => {
    if (selectedProductCategory) {
      resetForm({
        values: {
          ...values,
          mmsValue: selectedProductCategory.label
            ? selectedProductCategory.label
            : '',
          mappingTypeId: mappingTypeIdResponse,
        },
      })
    }
  }, [selectedProductCategory, mappingTypeIdResponse])

  useEffect(() => {
    if (selectedMarketplaceType) {
      getMarketplaceProductCategoryOptions(selectedMarketplaceType.value)
      resetForm({
        values: {
          ...values,
          marketplaceTypeId: selectedMarketplaceType.value,
        },
      })
    }
  }, [selectedMarketplaceType])

  useEffect(() => {
    if (_.isEmpty(selectedMarketplaceProductCategories)) {
      handleSelectEmptyMarketplaceProductProperty()
    }
    if (selectedMarketplaceProductCategories.length === 1) {
      handleSelectSingleMarketplaceProductProperty()
    } else {
      handleSelectMultiMarketplaceProductProperties()
    }
  }, [selectedMarketplaceProductCategories])

  useEffect(() => {
    if (values.productPropertyValues.length <= 1) {
      setCategoryMappingsTableList([])
      setTotalRecords(0)
    } else {
      setCategoryMappingsTableList(values.productPropertyValues)
      setTotalRecords(values.productPropertyValues.length)
    }
  }, [values])

  useEffect(() => {
    isShouldNavigateBackToListPage &&
      goBackToViewListPage()
  }, [isShouldNavigateBackToListPage])

  useCallbackPrompt(!isShouldPreventCancelEditForm && dirty, persistState)

  useCommonAccesibility()

  useEffect(() => {
    document.querySelectorAll('[role="combobox"]').forEach((el) => {
      el.removeAttribute('role')
    })
    document.querySelectorAll('input[type=text]').forEach((el) => {
      el.removeAttribute('aria-expanded')
    })
  }, [])

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.productCategoryMappingEdit}
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('product_category_mapping_edit_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <form
            className='form-layout'
            onSubmit={handleSubmit}
            autoComplete='on'
          >
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='mmsValue'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('mmsValue'),
                      })}
                    >
                      {t('product_category_mapping_field_mms_product_category')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='mmsValue'
                      isDisabled
                      className={classNames('react-select inherit-color')}
                      value={selectedProductCategory}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceTypeId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('marketplaceTypeId'),
                      })}
                    >
                      {t('product_category_mapping_field_marketplace_type')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceTypeId'
                      isDisabled
                      className={classNames('react-select inherit-color')}
                      value={selectedMarketplaceType}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='productPropertyValues'
                      className={classNames('required', {
                        'p-error': isMarketplaceProductCategoryFieldInvalid(
                          'productPropertyValues'
                        ),
                      })}
                    >
                      {t(
                        'product_category_mapping_field_marketplace_product_category'
                      )}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='productPropertyValues'
                      options={marketplaceProductCategoryOptions}
                      isSearchable
                      className={classNames('react-select inherit-color', {
                        'invalid-field':
                          isMarketplaceProductCategoryFieldInvalid(
                            'productPropertyValues'
                          ),
                      })}
                      value={selectedMarketplaceProductCategories}
                      onChange={handleChangeMarketplaceProductCategories}
                      onBlur={(_e) => {
                        setFieldTouched('productPropertyValues')
                      }}
                      isMulti
                      placeholder={t(
                        'product_category_mapping_field_marketplace_product_category_placeHolder'
                      )}
                    />
                  </Col>
                </Row>
              </Container>
            </Row>
            <br />
            {values.productPropertyValues.length > 1 && (
              <>
                <Row>
                  <DataTable
                    totalRecords={totalRecords}
                    dataKey='id'
                    value={categoryMappingsTableList}
                    rows={totalRecords}
                    emptyMessage={() => null}
                    className='px-0'
                  >
                    <Column
                      headerClassName='max-w-2/5'
                      header={t(
                        'product_category_mappings_add_table_header_column_marketplace_product_category'
                      )}
                      body={(data: IUpdateCategoryMappingTableRow) => (
                        <FieldTextDataTable
                          value={data.marketplaceValue}
                          placement='bottom'
                        />
                      )}
                    ></Column>
                    <Column
                      headerClassName='max-w-2/5'
                      header={t(
                        'product_category_mappings_add_table_header_column_product_property'
                      )}
                      body={(data: IUpdateCategoryMappingTableRow) => (
                        <Select
                          id='splitProperty'
                          name='splitProperty'
                          options={splitPropertiesOption}
                          isSearchable
                          className={classNames('react-select inherit-color', {
                            'invalid-field': isProductPropertieValuesFieldValid(
                              data.id,
                              'splitProperty'
                            ),
                          })}
                          value={detectSplitProperty(data.id)}
                          onChange={(v, act) =>
                            handleChangeSplitProperty(v, {
                              ...act,
                              name: data.id,
                            })
                          }
                          placeholder={''}
                          onBlur={(v) =>
                            handleBlurSplitPropertyField(v, data.id)
                          }
                        />
                      )}
                    ></Column>
                    <Column
                      headerClassName='max-w-2/5'
                      header={t(
                        'product_category_mappings_add_table_header_column_property_value'
                      )}
                      body={(data: IUpdateCategoryMappingTableRow) => (
                        <Select
                          id='splitValue'
                          name='splitValue'
                          options={detectSplitValuesOption(data.id)}
                          isSearchable
                          className={classNames('react-select inherit-color', {
                            'invalid-field': isProductPropertieValuesFieldValid(
                              data.id,
                              'splitValue'
                            ),
                          })}
                          value={detectSplitValue(data.id)}
                          onChange={(v, act) =>
                            handleChangeSplitValue(v, {...act, name: data.id})
                          }
                          placeholder={''}
                          onBlur={(v) => handleBlurSplitValueField(v, data.id)}
                        />
                      )}
                    ></Column>
                  </DataTable>
                </Row>
                <br />
              </>
            )}
            <Row>
              <Container fluid>
                <Row>
                  <Col>
                    <div className='d-flex justify-content-center'>
                      <Button
                        className='me-2'
                        onClick={handleCancel}
                        variant='danger'
                        disabled={isSubmitting}
                      >
                        {t('common_confirm_cancel')}
                      </Button>
                      <Button
                        variant='success'
                        className='me-2'
                        onClick={() => handleSubmit()}
                        disabled={
                          isSubmitting ||
                          (Boolean(productCategoryMappingsId) &&
                            checkHasPermissions &&
                            !checkHasPermissions([
                              PERMISSIONS.edit_product_category_mapping,
                            ]))
                        }
                      >
                        {t('common_confirm_save')}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}
