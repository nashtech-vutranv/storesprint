import {
  DataTable,
  DataTableSortOrderType,
  DataTableSelectionChangeParams,
} from 'primereact/datatable'
import {InputText} from 'primereact/inputtext'
import {useEffect, useState, useContext, useRef, ChangeEvent} from 'react'
import {Button, Card, Col, Row} from 'react-bootstrap'
import {Button as ButtonPrime} from 'primereact/button'
import {useTranslation} from 'react-i18next'
import {Column} from 'primereact/column'
import {useParams} from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import {MultiValue, ActionMeta} from 'react-select'
import _ from 'lodash'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {
  useCommonAccesibility,
  useOutsideClick,
  useCallbackPrompt,
  useHandleError,
  usePreviousPage
} from '../../hooks'
import FieldTextDataTable from '../../components/FieldTextDataTable/FieldTextDataTable'
import {axiosClient, GlobalContext} from '../../store/GlobalContext'
import {
  ROUTE_PRODUCT_PROPERTY_MAPPINGS,
  ROUTE_PARAMS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
} from '../../constants'
import BreadCrumb, {BreadcrumbItems} from '../../components/BreadCrumb'
import {
  IValueMappingsRequest,
  ISelectOption,
  IUpdateValueMappingRequest,
  IValueMappings,
  IValueMapping,
} from '../../interface'
import MappingsServices from '../../services/MappingService'
import {ToastContext} from '../../providers'

export default function ValueMappings() {
  const {t} = useTranslation()

  const [enumValueMappings, setEnumValueMappings] = useState<IValueMappings>([])
  const [mmsProductPropertyOption, setMMSProductPropertyOptions] = useState<
    ISelectOption[]
  >([])
  const [isRefreshEnumValueMappingsList, setIsRefreshEnumValueMappingList] =
    useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [sortField, setSortField] = useState<string>(
    'mappingTarget.marketplaceValue'
  )
  const [sortOrder, setSortOrder] = useState<DataTableSortOrderType>(1)
  const [keyword, setKeyword] = useState<string>('')
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [searchCount, setSearchCount] = useState<number>(0)
  const [disabledIcons, setDisabledIcons] = useState<
    {id: string; isDisabled: boolean; error: string | null}[]
  >([])
  const [isDirty, setIsDirty] = useState<boolean>(false)

  const {
    productCategoryMappingsId,
    marketplaceTypeId,
    mappingTargetId,
    productPropertyAttributeId,
  } = useParams()

  const originEnumValueMapping = useRef<IValueMappings>()
  const tableRef = useRef<any>()

  const {
    state: {
      pagesInfo: {
        productPropertyMappings: {
          selectedRowData: {
            selectedMarketplaceTypeName,
            selectedMarketplaceProductProperty,
            selectedMMSProductProperty,
          },
          enumValueMappingData: {
            selectedMarketplaceTypeId,
            selectedPropertyName,
            selectedPropertyId,
          },
        },
      },
    },
  } = useContext(GlobalContext)
  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const {selectedRowId, setSelectedRowId} = useOutsideClick(tableRef)

  const handleChangeInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleBlurInputSearch = () => {
    setKeyword(keyword.trim())
  }

  const handleSearchValueMapping = () => {
    setSearchCount(searchCount + 1)
  }

  const handleSearchByEnterKey = (e: any) => {
    if (e.key === 'Enter') {
      handleSearchValueMapping()
    }
  }

  const refreshInitialState = () => {
    setKeyword('')
    setSortOrder(1)
    setIsRefreshEnumValueMappingList(true)
  }

  const getBreadcrumbItems = (): BreadcrumbItems[] => {
    return [
      {
        label: t('product_property_mappings_page_title'),
        active: false,
        path: ROUTE_PRODUCT_PROPERTY_MAPPINGS.ROOT.replace(
          ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID,
          productCategoryMappingsId || ''
        )
          .replace(ROUTE_PARAMS.MARKETPLACE_TYPE_ID, marketplaceTypeId || '')
          .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || ''),
      },
      {
        label: `${selectedMarketplaceTypeName} / ${selectedMarketplaceProductProperty}`,
        active: false,
        path: ROUTE_PRODUCT_PROPERTY_MAPPINGS.EDIT.replace(
          ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID,
          productCategoryMappingsId || ''
        )
          .replace(ROUTE_PARAMS.MARKETPLACE_TYPE_ID, marketplaceTypeId || '')
          .replace(ROUTE_PARAMS.MAPPING_TARGET_ID, mappingTargetId || '')
          .replace(
            ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID,
            productPropertyAttributeId || ''
          )
          .replace(
            ROUTE_PARAMS.MMS_PRODUCT_PROPERTY,
            selectedMMSProductProperty || ''
          ),
      },
      {
        label: t('product_value_mapping_page_title'),
        active: true,
      },
    ]
  }

  const renderHeader = () => {
    return (
      <Row>
        <div className='d-flex justify-content-start align-items-center'>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8} className='btn-mr-1'>
            <InputText
              value={keyword}
              onChange={handleChangeInputSearch}
              placeholder={t('common_input_search_placeHolder')}
              className='w-100'
              onBlur={handleBlurInputSearch}
              onKeyDown={handleSearchByEnterKey}
            />
          </Col>
          <Button onClick={handleSearchValueMapping} className='btn-h-95'>
            {t('common_button_search_label')}
          </Button>
        </div>
      </Row>
    )
  }

  const paginatorLeft = (
    <ButtonPrime
      aria-label='refresh-button'
      type='button'
      icon='pi pi-refresh'
      className='p-button-text'
      onClick={refreshInitialState}
      tooltip={t('common_button_refresh_table')}
    />
  )

  const handleChangeMMSProductPropertyValue = (
    multipleMMSProductPropertyObj: MultiValue<ISelectOption>,
    action: ActionMeta<ISelectOption>
  ) => {
    const trimMultipleMMSProductPropertyObj = multipleMMSProductPropertyObj.map(
      (item) => ({
        label: item.label.trim(),
        value: item.label.trim(),
      })
    )
    const uniqMultipleMMSProductPropertyObj = _.uniqBy(
      trimMultipleMMSProductPropertyObj,
      'value'
    )
    setDisabledIcons(
      disabledIcons.map((icon) =>
        icon.id === action.name
          ? {
              ...icon,
              isDisabled: false,
              error: null,
            }
          : {...icon, error: null}
      )
    )
    setEnumValueMappings(
      enumValueMappings.map((item) =>
        item.mappingTarget.id === action.name
          ? {
              ...item,
              mappings: uniqMultipleMMSProductPropertyObj.map(
                (mmsProductPropertyObj) => {
                  const availableItem = item.mappings
                    ? item.mappings.find(
                        (target) =>
                          target.mmsValue === mmsProductPropertyObj.label
                      )
                    : null
                  if (availableItem) {
                    return {
                      ...availableItem,
                    }
                  }
                  return {
                    id: '',
                    createdAt: '',
                    modifiedAt: '',
                    mmsValue: mmsProductPropertyObj.label,
                    version: 0,
                    mappingTypeId: item.mappingTarget.mappingTypeId,
                    marketplaceTypeId: item.mappingTarget.mappingTypeId,
                    marketplaceValue: item.mappingTarget.marketplaceValue,
                  }
                }
              ),
            }
          : item
      )
    )
  }

  const getEnumValueMappings = async (requestData: IValueMappingsRequest) => {
    try {
      const enumValueMappingsResponse = await new MappingsServices(
        axiosClient
      ).getMappingProductEnumValues(requestData)
      const transformEnumValueMappings = enumValueMappingsResponse.data.map(
        (item) => ({
          ...item,
          mappings: !item.mappings ? [] : item.mappings,
        })
      )
      setEnumValueMappings(transformEnumValueMappings)
      setDisabledIcons(
        enumValueMappingsResponse.data.map((item) => ({
          id: item.mappingTarget.id,
          isDisabled: true,
          error: null,
        }))
      )
      originEnumValueMapping.current = transformEnumValueMappings
      setTotalRecords(enumValueMappingsResponse.data.length)
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const getMMSProductPropertyValues = async (propertyId: string) => {
    try {
      const mmsProductPropertyValuesResponse = await new MappingsServices(
        axiosClient
      ).getMMSProductPropertyValues(propertyId)
      setMMSProductPropertyOptions(
        mmsProductPropertyValuesResponse.data.map((propertyValue) => ({
          label: propertyValue,
          value: propertyValue,
        }))
      )
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const showSuccessToast = (detail: string) => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t(detail),
      life: 5000,
    })
  }

  const showFailToast = (detail: string) => {
    toast?.current.show({
      severity: 'error',
      summary: t('toast_fail_title'),
      detail: t(detail),
      life: 5000,
    })
  }

  const getSortOrder = (order: any) => {
    switch (order) {
      case 1:
        return 'asc'
      case -1:
        return 'desc'
      default:
        return 'asc'
    }
  }

  const handleSortDataTable = (event: any) => {
    const order = getSortOrder(event.sortOrder)
    if (event.sortField === 'mappingTarget.marketplaceValue') {
      const orderredData = _.orderBy(
        enumValueMappings,
        (p) => {
          return p.mappingTarget.marketplaceValue
        },
        order
      )
      setEnumValueMappings(orderredData)
    }
    setSortField(event.sortField)
    setSortOrder(event.sortOrder)
  }

  const handleResetValueMappingRowData = (rowId: string) => {
    if (isSubmitting) return
    setEnumValueMappings(
      enumValueMappings.map((it, idx) =>
        it.mappingTarget.id === rowId &&
        originEnumValueMapping &&
        originEnumValueMapping.current
          ? originEnumValueMapping.current[idx]
          : it
      )
    )
  }

  const handleSuccessSaveEditValueMapping = async (
    _availableEnumValueMapping: IValueMapping,
    _rowId : string
  ) => {
    const {
      mappingTarget: {mappingTypeId, marketplaceValue, marketplaceCode},
      mappings,
    } = _availableEnumValueMapping
    const requestData: IUpdateValueMappingRequest = {
      marketplaceTypeId: marketplaceTypeId || '',
      mappingTypeId,
      marketplaceValue,
      marketplaceCode,
      mmsValues: mappings ? mappings.map((mp) => mp.mmsValue) : [],
    }
    try {
      setIsSubmitting(true)
      const updatedEnumValuMappingResponse = await new MappingsServices(
        axiosClient
      ).updateEnumValueMapping(requestData)
      if (updatedEnumValuMappingResponse) {
        setIsSubmitting(false)
        showSuccessToast(t('toast_success_modified'))
        setIsRefreshEnumValueMappingList(true)
      }
    } catch (err: any) {
      handleErrorSaveEditValueMapping(err, _rowId)
    }
  }

  const handleErrorSaveEditValueMapping = (_err: any, _rowId: string) => {
    setIsSubmitting(false)
    if (
      _err.response.data &&
      _err.response.data.status === BAD_REQUEST_ERROR &&
      _err.response.data.errorCode === 'DUPLICATE_ENUM_VALUE_MAPPING'
    ) {
      showFailToast(t('toast_fail_update_value_mapping'))
      setDisabledIcons(
        disabledIcons.map((icon) =>
          icon.id === _rowId
            ? {
                ...icon,
                error: _err.response.data.errorCode,
              }
            : icon
        )
      )
    }
    if (_err.response.data.status === NOT_FOUND_ERROR) {
      showFailToast(_err.response.data.error)
    } else {
      handleErrorResponse(_err)
    }
  }

  const handleSaveEditedValueMapping = async (rowId: string) => {
    if (isSubmitting) return
    const findIcon = disabledIcons.find((icon) => icon.id === rowId)
    if (findIcon && (findIcon.isDisabled || findIcon.error)) return
    const availableEnumValueMapping = enumValueMappings.find(
      (item) => item.mappingTarget.id === rowId
    )
    if (!availableEnumValueMapping) return
    handleSuccessSaveEditValueMapping(availableEnumValueMapping, rowId)
  }

  const handleSelectionChange = (e: DataTableSelectionChangeParams) => {
    setSelectedRowId(e.value.mappingTarget.id)
  }

  const handleFocusSelectInput = (rowId: string) => {
    setSelectedRowId(rowId)
  }

  const conditionMappingsDifferentLength = (
    originEl: IValueMapping,
    ev: IValueMapping
  ) => {
    return (
      (_.isEmpty(originEl?.mappings) && !_.isEmpty(ev.mappings)) ||
      (_.isEmpty(ev.mappings) && !_.isEmpty(originEl?.mappings)) ||
      ev.mappings.length !== originEl?.mappings.length
    )
  }

  const conditionMappingsSameLength = (
    originEl: IValueMapping,
    ev: IValueMapping
  ) => {
    return (
      !_.isEmpty(originEl?.mappings) &&
      !_.isEmpty(ev.mappings) &&
      ev.mappings.length === originEl?.mappings.length
    )
  }

  const isEnumValueMappingsUpdated: () => boolean = () => {
    let isUpdated = false
    if (originEnumValueMapping.current) {
      enumValueMappings.forEach((ev, idx) => {
        const originEl = (originEnumValueMapping.current as IValueMappings)[idx]
        if (conditionMappingsDifferentLength(originEl, ev)) {
          isUpdated = true
        }
        if (conditionMappingsSameLength(originEl, ev)) {
          const result = ev.mappings.every((mp) =>
            originEl.mappings.some((ov) => ov.mmsValue === mp.mmsValue)
          )
          if (!result) isUpdated = true
        }
      })
    }
    return isUpdated
  }

  useEffect(() => {
    getEnumValueMappings({
      marketplaceTypeId: selectedMarketplaceTypeId,
      propertyName: selectedPropertyName,
      search: keyword,
    })
  }, [searchCount])

  useEffect(() => {
    selectedPropertyId && getMMSProductPropertyValues(selectedPropertyId)
  }, [selectedPropertyId])

  useEffect(() => {
    if (isRefreshEnumValueMappingsList) {
      getEnumValueMappings({
        marketplaceTypeId: selectedMarketplaceTypeId,
        propertyName: selectedPropertyName,
        search: keyword,
      })
      setIsRefreshEnumValueMappingList(false)
    }
  }, [isRefreshEnumValueMappingsList])

  useEffect(() => {
    document.querySelectorAll('input').forEach((el: any) => {
      el.parentNode.classList.add('d-flex')
    })
  }, [document.querySelectorAll('input')])

  useEffect(() => {
    document.querySelectorAll('[role="combobox"]').forEach((el) => {
      el.setAttribute('aria-label', 'combobox')
    })
  }, [document.querySelectorAll('[role="combobox"]')])

  useCommonAccesibility()

  useCallbackPrompt(isDirty)

  useEffect(() => {
    setIsDirty(isEnumValueMappingsUpdated())
  }, [enumValueMappings])

  usePreviousPage('apps-value-mappings', {})

  return (
    <>
      <SeoConfig
        seoProperty={seoProperty.productPropertyValueMapping}
      ></SeoConfig>
      <BreadCrumb
        origin='productCategoryMapping'
        breadCrumbItems={getBreadcrumbItems()}
      />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Header>
              <h4 className='card-form__title'>
                {t('product_value_mapping_page_title')}
              </h4>
            </Card.Header>
          </Card>
        </Col>

        <DataTable
          ref={tableRef}
          sortField={sortField}
          sortOrder={sortOrder}
          totalRecords={totalRecords}
          dataKey='id'
          value={enumValueMappings || undefined}
          rows={totalRecords}
          selectionMode='single'
          header={renderHeader}
          paginatorClassName='table-paginator paginator-mapping'
          emptyMessage={''}
          paginatorLeft={paginatorLeft}
          paginatorTemplate={''}
          lazy
          onSort={handleSortDataTable}
          paginator
          onSelectionChange={handleSelectionChange}
          tableClassName='table-mapping w-full'
        >
          <Column
            headerClassName='max-w-2/5'
            header={t(
              'product_value_mapping_column_header_marketplace_product_property_value'
            )}
            field='mappingTarget.marketplaceValue'
            sortable
            body={(data: IValueMapping) => (
              <FieldTextDataTable
                value={data.mappingTarget.marketplaceValue}
                placement='bottom'
              />
            )}
          ></Column>
          <Column
            headerClassName='max-w-2/5'
            header={t(
              'product_value_mapping_column_header_mms_product_property_value'
            )}
            field='mappings'
            body={(data: IValueMapping) => (
              <CreatableSelect
                isMulti
                options={mmsProductPropertyOption}
                onChange={(e, action) =>
                  handleChangeMMSProductPropertyValue(e, {
                    ...action,
                    name: data.mappingTarget.id,
                  })
                }
                value={
                  data.mappings
                    ? data.mappings.map((it) => ({
                        label: it.mmsValue,
                        value: it.mmsValue,
                      }))
                    : null
                }
                placeholder={''}
                onFocus={() => handleFocusSelectInput(data.mappingTarget.id)}
                noOptionsMessage={() => null}
                className={'react-select inherit-color'}
              />
            )}
          ></Column>
          <Column
            headerClassName='max-w-1/5'
            header={''}
            body={(data: IValueMapping) =>
              data.mappingTarget.id === selectedRowId ? (
                <div className='d-flex justify-content-end align-items-center h-100'>
                  <i
                    className='dripicons-cross dripicons-md-size close-icon d-flex align-items-center'
                    onClick={() =>
                      handleResetValueMappingRowData(data.mappingTarget.id)
                    }
                  ></i>
                  <i
                    className='dripicons-checkmark dripicons-md-size tick-icon d-flex align-items-center ms-4'
                    onClick={() =>
                      handleSaveEditedValueMapping(data.mappingTarget.id)
                    }
                  ></i>
                </div>
              ) : (
                <div className='d-flex justify-content-end align-items-center h-100'>
                  <i className='dripicons-cross dripicons-md-size hidden-icon d-flex align-items-center'></i>
                  <i className='dripicons-checkmark dripicons-md-size hidden-icon d-flex align-items-center ms-4'></i>
                </div>
              )
            }
          ></Column>
        </DataTable>
      </Row>
    </>
  )
}
