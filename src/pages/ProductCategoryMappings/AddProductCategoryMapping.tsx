import {useState, useEffect, useContext, useRef, SetStateAction, FocusEvent} from 'react'
import {useLocation} from 'react-router-dom'
import {Card, Col, Container, Row, Button, Form} from 'react-bootstrap'
import Select, {SingleValue, MultiValue, ActionMeta} from 'react-select'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {useTranslation} from 'react-i18next'
import _ from 'lodash'
import {useFormik} from 'formik'
import classNames from 'classnames'
import {useCallbackPrompt, usePersistLocationState, useCommonAccesibility, useHandleError, useGoBack} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import ProductCategoryMappingsService from '../../services/ProductCategoryMappingsService'
import ProductPropertiesService from '../../services/ProductPropertiesService'
import MappingService from '../../services/MappingService'
import {GlobalContext} from '../../store/GlobalContext'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {
  transformProductCategoryFormData,
  transformMarketplaceTypeFormData,
  transformMarketplaceProductCategoryFormData,
  transformToSelectData,
} from '../../helpers'
import {
  ISelectOption,
  ICreateTableSelectOption,
  IAddProductCategoriesMapping,
  IAddProductCategoriesMappingForm,
  ICategoryMappingTableList,
  ICategoryMappingTableRow,
  ICurrentSelectProperty
} from '../../interface'
import {ToastContext} from '../../providers'
import {ROUTE_PRODUCT_CATEGORY_MAPPINGS} from '../../constants'
import {defaultTablePaginationSortByErpIdPerPage} from '../../constants/pagination'
import OrganizationServices from '../../services/OrganizationService'

export default function AddProductCategoryMapping() {
  const {t} = useTranslation()
  const location = useLocation()
  const {state: persistState} = usePersistLocationState(location)
  const [categoryMappingsTableList, setCategoryMappingsTableList] =
    useState<ICategoryMappingTableList>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [mmsProductCategoryOptions, setMMSProductCategoryOptions] = useState<
    ICreateTableSelectOption[]
  >([])
  const [marketplaceTypeOptions, setMarketplaceTypeOptions] = useState<
    ISelectOption[]
  >([])
  const [selectedOrganization, setSelectedOrganization] = useState<ISelectOption| null>()
  const [selectOrganizationOptions, setSelectOrganizationOptions] = useState<ISelectOption[]>([])
  const [
    marketplaceProductCategoryOptions,
    setMarketplaceProductCategoryOptions,
  ] = useState<Array<ISelectOption & {code: string | null}>>([])
  const [selectedMarketplaceType, setSelectedMarketplaceType] =
    useState<ISelectOption | null>(null)
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ICreateTableSelectOption | null>(null)
  const [
    selectedMarketplaceProductCategories,
    setSelectedMarketplaceProductCategories,
  ] = useState<Array<ISelectOption & {code: string | null}>>([])
  const [splitPropertiesOption, setSplitPropertiesOption] = useState<
  {erpId: string, label: string, value: string}[]>([])
  const [currentSelectPropertyInfo, setCurrentSelectPropertyInfo] = useState<ICurrentSelectProperty | null>(null)
  const [isAddOtherMappingChecked, setIsAddOtherMappingChecked] =
    useState<boolean>(false)
  const [isShouldPreventCancelEditForm, setIsShouldPreventCancelEditForm] =
    useState<boolean>(false)
  const [isShouldNavigateBackToListPage, setIsShouldNavigateBackToListPage] =
    useState<boolean>(false)
  const [duplicateInlineMessage, setDuplicateInlineMessage] = useState<string | null>(null)

  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {toast} = useContext(ToastContext)

  const {goBackToViewListPage} = useGoBack(persistState, ROUTE_PRODUCT_CATEGORY_MAPPINGS.ROOT)

  const mmsProductCategoryRef = useRef<any>()
  const marketplaceProductCategoryRef = useRef<any>()
  const initialValueFormRef = useRef<IAddProductCategoriesMappingForm>({
    version: 0,
    marketplaceTypeId: null,
    mmsValue: null,
    mappingTypeId: null,
    organizationId: null,
    productPropertyValues: []
  })
  const mmsProductCategoryMaxChar = useRef(255)

  const getMMSProductCategoryOptions = async (_selectedOrgId: string) => {
    try {
      const mmsProductCategoryResponse =
        await new ProductCategoryMappingsService(
          axiosClient
        ).getProductCategory(_selectedOrgId)
      setMMSProductCategoryOptions(
        transformProductCategoryFormData(mmsProductCategoryResponse.data)
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const getMarketplaceTypeOptions = async () => {
    try {
      const marketplaceTypeResponse = await new MappingService(
        axiosClient
      ).getAllMappingMarketplaces()
      setMarketplaceTypeOptions(
        transformMarketplaceTypeFormData(marketplaceTypeResponse.data)
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const getMarketplaceProductCategoryOptions = async (
    _selectedMarketplaceType: ISelectOption
  ) => {
    try {
      const marketplaceProductCategoryResponse = await new MappingService(
        axiosClient
      ).getMappingTargetInProductCategory(_selectedMarketplaceType.value)
      setMarketplaceProductCategoryOptions(
        transformMarketplaceProductCategoryFormData(
          marketplaceProductCategoryResponse.data
        )
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const handleChangeMarketplaceType = (_selectedMarketplaceType: any) => {
    setDuplicateInlineMessage(null)
    setSelectedMarketplaceType(_selectedMarketplaceType)
  }

  const handleChangeProductCategorySelectValue = (selectedValue: any) => {
    setDuplicateInlineMessage(null)
    if (!selectedValue) {
      setSelectedProductCategory({
        label: '',
        value: null,
      })
    } else if (!selectedValue.__isNew__) {
      setSelectedProductCategory(selectedValue)
    } else {
      const trimValue =
        selectedValue.label.length < mmsProductCategoryMaxChar.current
          ? selectedValue.label
          : selectedValue.label.slice(0, mmsProductCategoryMaxChar.current)
      setSelectedProductCategory({
        label: trimValue,
        value: null,
      })
    }
  }

  const handleChangeMarketplaceProductCategories = (
    _selectedMarketplaceProductCategories: MultiValue<ISelectOption & {code: string | null}>) => {
      setDuplicateInlineMessage(null)
      setTouched({}, false)
      setSelectedMarketplaceProductCategories(
        _selectedMarketplaceProductCategories as SetStateAction<
          (ISelectOption & {
            code: string | null
          })[]
        >
      )
  }

  const handleChangeAddOtherMappingStatus = (e: any) => {
    setIsAddOtherMappingChecked(e.target.checked)
  }

  const updateFormValuesWithCurrentSelectProperty = async (currentSelectProperty: ICurrentSelectProperty) => {
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

  const handleChangeSplitProperty = async (
    _selectedSplitProperty: SingleValue<any>,
    action: ActionMeta<any>
  ) => {
    setDuplicateInlineMessage(null)
    if (!_selectedSplitProperty) return
    setCurrentSelectPropertyInfo({
      rowId: action.name,
      propertyId: _selectedSplitProperty.value || ''
    })
    setFieldValue(
      'productPropertyValues',
      values.productPropertyValues.map((item) =>
        item.id === action.name
          ? {
              ...item,
              splitProperty: _selectedSplitProperty.erpId,
              splitPropertyId: _selectedSplitProperty.value,
              splitPropertyName: _selectedSplitProperty.label,
              splitValue: null
            }
          : item
      ))
  }

  const handleChangeSplitValue = (
    _selectedSplitValue: SingleValue<ISelectOption>,
    action: ActionMeta<ISelectOption>
  ) => {
    setDuplicateInlineMessage(null)
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
    _productPropertiesId: string
  ) => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertiesId)
    indexOfSpecifiedId !== -1 && 
    setFieldTouched(`productPropertyValues.${indexOfSpecifiedId}.splitProperty`, true)
  }

  const handleBlurSplitValueField = (
    _e: FocusEvent<HTMLInputElement> | undefined,
    _productPropertiesId: string
  ) => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertiesId
    )
    indexOfSpecifiedId !== -1 &&
      setFieldTouched(
        `productPropertyValues.${indexOfSpecifiedId}.splitValue`,
        true
      )
  }

  const detectSplitProperty = (_productPropertiesId: string) => {
    const productPropertyFindById = values.productPropertyValues.find(
      (item) => item.id === _productPropertiesId
    )
    if (productPropertyFindById) {
      return {
        value: productPropertyFindById.splitProperty,
        label:
          splitPropertiesOption.find(
            (item) => item.erpId === productPropertyFindById.splitProperty
          )?.label || '',
        erpId:
          splitPropertiesOption.find(
            (item) => item.erpId === productPropertyFindById.splitProperty
          )?.erpId || '',
      }
    }
    return null
  }

  const detectSplitValue: (
    _productPropertiesId: string
  ) => ISelectOption | null = (_productPropertiesId: string) => {
    const productPropertyFindById = values.productPropertyValues.find(
      (item) => item.id === _productPropertiesId
    )
    if (productPropertyFindById) {
      return {
        label: productPropertyFindById.splitValue as string,
        value: productPropertyFindById.splitValue as string,
      }
    }
    return null
  }

  const detectSplitValuesOption: (
    _productPropertiesId: string
  ) => ISelectOption[] = (_productPropertiesId: string) => {
    const productPropertyFindById = values.productPropertyValues.find(
      (item) => item.id === _productPropertiesId
    )
    if (productPropertyFindById) {
      return productPropertyFindById.propertyValuesOption
    }
    return []
  }

  const showProductCategoryMappingSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('product_category_mapping_add_success_message'),
      life: 5000,
    })
  }

  const showProductCategoryMappingFailAdded = () => {
    toast?.current.show({
      severity: 'error',
      summary: t('toast_fail_title'),
      detail: t('toast_fail_update_value_mapping'),
      life: 5000,
    })
  }

  const resetInitialStateForm = () => {
    setSelectedProductCategory(null)
    setSelectedMarketplaceType(null)
    setSelectedMarketplaceProductCategories([])
    marketplaceProductCategoryRef &&
      marketplaceProductCategoryRef.current.clearValue()
    resetForm({
      values: initialValueFormRef.current
    })
    setTouched({}, false)
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    errors,
    touched,
    setTouched,
    dirty,
    resetForm,
    values,
  } = useFormik<IAddProductCategoriesMappingForm>({
    initialValues: initialValueFormRef.current,
    onSubmit: (data) => {
      const requestData = {
        ...data,
        productPropertyValues: data.productPropertyValues.map((it) =>
          _.omit(it, ['id', 'splitPropertyId', 'propertyValuesOption'])
        ),
      }
      setSubmitting(true)
      setIsShouldPreventCancelEditForm(true)
      new ProductCategoryMappingsService(axiosClient)
        .addProductCategoriesMapping(requestData)
        .then((_response) => {
          setSubmitting(false)
          showProductCategoryMappingSuccessAdded()
          if (!isAddOtherMappingChecked) {
            setIsShouldNavigateBackToListPage(true)
          } else {
            setIsShouldPreventCancelEditForm(false)
            resetInitialStateForm()
          }
        })
        .catch((err) => {
          setSubmitting(false)
          setIsShouldPreventCancelEditForm(false)
          if (
            err.response.data.errorCode ===
              'DUPLICATE_PRODUCT_PROPERTY_AND_PROPERTY_VALUE_MAPPING'
          ) {
            showProductCategoryMappingFailAdded()
          }
          if (
            err.response.data.errorCode ===
            'DUPLICATE_MMS_VALUE_AND_MARKETPLACE_TYPE'
          ) {
            setDuplicateInlineMessage(
              t('product_category_mapping_add_duplicate_error_message')
            )
          } else {
            handleErrorResponse(err)
          }
        })
    },
    validate: (validateData: IAddProductCategoriesMappingForm) => {
      let validErrors: any = {}
      if (!validateData.organizationId) {
        validErrors.organizationId = t('form_validate_required')
      }
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
        validateData.productPropertyValues.length > 1 && validateData.productPropertyValues.find(
          (item) => !item.splitProperty || !item.splitValue
        )
      ) {
        validErrors.productPropertyValues = t('form_validate_required')
      }
      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IAddProductCategoriesMapping) => {
    return !!(touched[name] && errors[name])
  }

  const isMarketplaceProductCategoryFieldInvalid = (
    name: keyof IAddProductCategoriesMapping
  ) => {
    return (
      touched[name] && _.isEmpty(values.productPropertyValues)
    )
  }

  const isProductPropertieValuesFieldValid = (_productPropertyId: string, fieldName: 'splitProperty' | 'splitValue') => {
    const indexOfSpecifiedId = values.productPropertyValues.findIndex(
      (item) => item.id === _productPropertyId
    )
    if (indexOfSpecifiedId !== -1 && touched 
      && touched.productPropertyValues && !_.isEmpty(touched.productPropertyValues)) {
      switch (fieldName) {
        case 'splitProperty':
          if (touched.productPropertyValues[indexOfSpecifiedId]) {
            return (
              touched.productPropertyValues[indexOfSpecifiedId].splitProperty &&
              !values.productPropertyValues[indexOfSpecifiedId].splitProperty
            )
          } return false
          
        case 'splitValue':
          if (touched.productPropertyValues[indexOfSpecifiedId]) {
            return (
              touched.productPropertyValues[indexOfSpecifiedId].splitValue &&
              !values.productPropertyValues[indexOfSpecifiedId].splitValue
            )
          } return false
            
        default: 
      }
    }
  }

  const handleBackToProductCategoryMappingList = () => {
    goBackToViewListPage()
  }

  const handleCancel = () => {
    !isShouldPreventCancelEditForm && handleBackToProductCategoryMappingList()
  }

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

    } catch(err: any) {
      handleErrorResponse(err)
    }
  }

  const handleChangeOrganization = (e: any) => {
    setSelectedOrganization(e)
  }

  useEffect(() => {
    getAllProductProperties()
  }, [])

  useEffect(() => {
    new OrganizationServices(axiosClient)
      .getAllOrganizations({
        ...defaultTablePaginationSortByErpIdPerPage,
        rows: 1000,
      })
      .then((response: any) => {
        const organizationsSelectData = transformToSelectData(
          response.data.content
        )
        setSelectOrganizationOptions(organizationsSelectData)
        if (response.data.content.length === 1) {
          setSelectedOrganization(organizationsSelectData[0])
        }
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }, [])

  useEffect(() => {
    if (currentSelectPropertyInfo) {
      updateFormValuesWithCurrentSelectProperty(currentSelectPropertyInfo)
    }
  }, [currentSelectPropertyInfo])

  useEffect(() => {
    if (persistState && persistState.unMappedMmsProductCategory !== undefined) {
      const option = {
        label: persistState.unMappedMmsProductCategory,
        value: '',
      }
      setMMSProductCategoryOptions([option, ...mmsProductCategoryOptions])
      setSelectedProductCategory(option)
      resetForm({
        values: {
          ...initialValueFormRef.current,
          mmsValue: persistState.unMappedMmsProductCategory
        },
      })
    } 
  }, [persistState])

  useEffect(() => {
    getMarketplaceTypeOptions()
  }, [])

  useEffect(() => {
    if (_.isEmpty(selectedOrganization)) {
      return
    }
    selectedOrganization && getMMSProductCategoryOptions(
      selectedOrganization.value
    )
    setFieldValue(
      'organizationId',
      selectedOrganization?.label ? selectedOrganization.label : ''
    )
  }, [selectedOrganization])

  useEffect(() => {
    if (_.isEmpty(selectedProductCategory) || _.isEmpty(mmsProductCategoryOptions)) {
      return
    }
    if (selectedProductCategory && mmsProductCategoryOptions.length > 0) {

      setFieldValue(
        'mmsValue',
        selectedProductCategory.label ? selectedProductCategory.label : ''
      )
      const mmsProductCategoryInput = document.querySelectorAll(
        '[class*="singleValue"]'
      )[1]
      if (mmsProductCategoryInput) {
        mmsProductCategoryInput.innerHTML = selectedProductCategory.label
      }
    }
  }, [selectedProductCategory, mmsProductCategoryOptions])

  useEffect(() => {
    if (selectedMarketplaceType) {
      setSelectedMarketplaceProductCategories([])
      marketplaceProductCategoryRef &&
        marketplaceProductCategoryRef.current.clearValue()
      getMarketplaceProductCategoryOptions(selectedMarketplaceType)
      setFieldValue('marketplaceTypeId', selectedMarketplaceType.value)
    }
  }, [selectedMarketplaceType])

  useEffect(() => {
    if (_.isEmpty(selectedMarketplaceProductCategories)) {
      return
    }
    if (selectedMarketplaceProductCategories.length === 1) {
      setFieldValue('productPropertyValues', [
        {
          marketplaceValue: selectedMarketplaceProductCategories[0].label,
          marketplaceCode: selectedMarketplaceProductCategories[0].code,
          splitProperty: null,
          splitValue: null,
          id: ''
        }
      ])
      return
    }
    setFieldValue('productPropertyValues', selectedMarketplaceProductCategories.map(item => {
      const availabelCategoryMappingsItem = categoryMappingsTableList.find(ctm => ctm.id === item.value)
      if (availabelCategoryMappingsItem) {
        return availabelCategoryMappingsItem
      }
      return {
        marketplaceValue: item.label,
        marketplaceCode: item.code,
        splitProperty: null,
        splitValue: null,
        id: item.value
      }
    }))
  }, [selectedMarketplaceProductCategories])

  useEffect(() => {
    isShouldNavigateBackToListPage && handleBackToProductCategoryMappingList()
  }, [isShouldNavigateBackToListPage])

  useEffect(() => {
    if (values.productPropertyValues.length <= 1) {
      setCategoryMappingsTableList([])
      setTotalRecords(0)
    } else {
      setCategoryMappingsTableList(values.productPropertyValues)
      setTotalRecords(values.productPropertyValues.length)
    }
  }, [values])

  useCallbackPrompt(
    (!isShouldPreventCancelEditForm && dirty),
    persistState
  )

  useCommonAccesibility()

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.productCategoryMappingAdd}
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('product_category_mapping_add_title')}
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
                      htmlFor='organizationId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('organizationId'),
                      })}
                    >
                      {t('product_category_mapping_field_organization')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      onChange={handleChangeOrganization}
                      onBlur={(_e) => setFieldTouched('organizationId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('organizationId'),
                      })}
                      placeholder={t(
                        'product_category_mapping_field_organization_placeHolder'
                      )}
                      options={selectOrganizationOptions}
                      isSearchable
                      isClearable
                      value={selectedOrganization}
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
                      ref={mmsProductCategoryRef}
                      onChange={(op) =>
                        handleChangeProductCategorySelectValue(op)
                      }
                      onBlur={(_e) => setFieldTouched('mmsValue')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('mmsValue'),
                      })}
                      placeholder={t(
                        'product_category_mapping_field_mms_product_category_placeHolder'
                      )}
                      options={mmsProductCategoryOptions}
                      isSearchable
                      isClearable
                      value={selectedProductCategory}
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
                      name='marketplaceTypeId'
                      options={marketplaceTypeOptions}
                      isSearchable
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('marketplaceTypeId'),
                      })}
                      value={selectedMarketplaceType}
                      onChange={(item) => handleChangeMarketplaceType(item)}
                      placeholder={t(
                        'product_category_mapping_field_marketplace_type_placeHolder'
                      )}
                      onBlur={(_e) => {
                        setFieldTouched('marketplaceTypeId')
                      }}
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
                      ref={marketplaceProductCategoryRef}
                    />
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row>
              <Container fluid>
                <Row className='align-items-center py-1'>
                  <Col xs={4}></Col>
                  <Col xs={8} className='p-fluid'>
                    <div className='col-8 col-offset-4 py-0'>
                      <small className='p-error text-sm'>
                        {duplicateInlineMessage}
                      </small>
                    </div>
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
                      field='mmsValue'
                      body={(data: ICategoryMappingTableRow) => (
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
                      body={(data: ICategoryMappingTableRow) => (
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
                          value={detectSplitProperty(data.id)}
                        />
                      )}
                    ></Column>
                    <Column
                      headerClassName='max-w-2/5'
                      header={t(
                        'product_category_mappings_add_table_header_column_property_value'
                      )}
                      body={(data: ICategoryMappingTableRow) => (
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
                <Row className='align-items-center py-1'>
                  <Col xs={12}>
                    <Form.Check
                      type='checkbox'
                      id='mappingCb'
                      label={t(
                        'product_category_mapping_check_box_add_other_mapping'
                      )}
                      onChange={(e) => handleChangeAddOtherMappingStatus(e)}
                    />
                  </Col>
                </Row>
                <br />
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
                        disabled={isSubmitting}
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
