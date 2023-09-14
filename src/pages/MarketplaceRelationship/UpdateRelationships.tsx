import {useState, useContext, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import Select from 'react-select'
import {v4 as uuidv4} from 'uuid'
import {InputSwitch} from 'primereact/inputswitch'
import {confirmDialog} from 'primereact/confirmdialog'
import {InputText} from 'primereact/inputtext'
import {Row, Col, Container, Button, Card} from 'react-bootstrap'
import classNames from 'classnames'
import _, {isEmpty} from 'lodash'
import {AxiosResponse} from 'axios'
import {ToastContext} from '../../providers'
import SeoConfig from '../../components/SEO/SEO-Component'
import {
  IFormMarketplaceRelationship,
  IFormRequestMarketplaceRelationship,
  IUpdateMarketplaceRelationship,
} from '../../interface/marketplaceRelationship'
import {
  ROUTE_MARKETPLACE_RELATIONSHIP,
  ROUTE_PARAMS,
  MARKETPLACE_INTEGRATION_STATE_KEY,
  seoProperty,
  BAD_REQUEST_ERROR,
  PERMISSIONS,
  CONFLICT_ERROR
} from '../../constants'
import DialogTemplate from '../../components/DialogTemplate'
import {IntegrationWindow} from '../../components/IntegrateWindow'
import OrganizationService from '../../services/OrganizationService'
import {
  usePagination,
  useCommonAccesibility,
  useSwitchAccesibility,
  useConditionForm,
  useCallbackPrompt,
  useSecretForm,
  useHandleError,
} from '../../hooks'
import {transformToSelectData} from '../../helpers'
import SiteServices from '../../services/SitesService'
import SiteLocaleService from '../../services/SiteLocaleService'
import MarketplaceService from '../../services/MarketplaceService'
import WarehouseServices from '../../services/WarehouseService'
import {GlobalContext} from '../../store/GlobalContext'
import MarketplaceRelationshipService from '../../services/MarketplaceRelationshipService'
import MarketplaceIntegrationService from '../../services/MarketplaceIntegrationService'
import {getIntegrationInfoFromLocal} from '../../helpers/localstorage'
import TiktokService from '../../services/TiktokService'
import ShopifyService from '../../services/ShopifyService'
import {
  IBigCommerceIntegration,
  IIntegration,
  IMagentoIntegration,
  IWooCommerceIntegration,
} from '../../interface'

const defaultBaseMarketplaceRelationship = {
  version: 0,
  marketplaceId: '',
  organizationId: '',
  siteId: '',
  siteLocaleId: '',
  aggregatorId: '',
  warehouseIds: [],
  stockMinimumLevel: 0,
  sellingPriceAdjustment: 0,
  isProductsReviewedBeforeListing: true,
  status: 'ACTIVE',
}

type IMarketplaceRelationshipErrors = {
  [key in keyof IFormMarketplaceRelationship]?: string
}

type IntegrationType =
  | 'Tiktok'
  | null
  | 'Amazon'
  | 'Shopify'
  | 'Magento'
  | 'BigCommerce'
  | 'WooCommerce'

interface INewWindowParam {
  url: string
  name: string
  title: string
}

interface IMagentoInformation {
  accessToken: string
  shopUrl: string
}

interface IBigCommerceInformation {
  clientId: string
  clientSecret: string
  storeHash: string
  accessToken: string
}

interface IWooCommerceInformation {
  shopUrl: string
  consumerKey: string
  consumerSecret: string
}

type ValidationError = IMagentoInformation &
  IBigCommerceInformation &
  IWooCommerceInformation

export default function UpdateRelationships() {
  const [integrationType, setIntegrationType] = useState<IntegrationType>(null)
  const [isWindowOpen, setIsWindowOpen] = useState<boolean>(false)
  const [newWindowObj, setNewWindowObj] = useState<INewWindowParam>({
    url: '',
    name: '',
    title: '',
  })
  const [localeMarketplaceId, setLocaleMarketplaceId] = useState<string | null>(
    null
  )
  const [
    isShouldIntegrationSuccessDisplay,
    setIsShouldIntegrationSuccessDisplay,
  ] = useState<boolean>(false)
  const [shopifyIntegrationAppType] = useState<'custom' | 'public'>('custom')
  const [countIntegrateWithCustomApp, setCountIntegrateWithCustomApp] =
    useState<number>(0)
  const [isDirtyOutSideForm, setIsDirtyOutSideForm] = useState<boolean>(false)

  const {t} = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()

  const {toast} = useContext(ToastContext)
  const {
    state: {
      auth,
      axiosClient,
      permissionInformations: {checkHasPermissions},
    },
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {marketplaceRelationshipsId} = useParams<{
    marketplaceRelationshipsId: string
  }>()

  const selectOrganizationRef = useRef<any>()
  const selectSiteRef = useRef<any>()
  const selectLocaleRef = useRef<any>()
  const selectWarehouseRef = useRef<any>()

  const {toggleHidingInput, inputsRef, iconsRef} = useSecretForm(4)

  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [
    selectedMarketplaceRelationshipId,
    setSelectedMarketplaceRelationshipId,
  ] = useState<any>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<any>()
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [selectedLocale, setSelectedLocale] = useState<any>()
  const [selectedMarketplace, setSelectedMarketplace] = useState<any>()
  const [selectedWarehouses, setSelectedWarehouses] = useState<any>()
  const [selectOrganizationOptions, setSelectOrganizationOptions] =
    useState<any>([])
  const [selectMarketplaceOptions, setSelectMarketplaceOptions] = useState<any>(
    []
  )
  const [selectSiteOptions, setSelectSiteOptions] = useState<any>([])
  const [selectLocaleOptions, setSelectLocaleOptions] = useState<any>([])
  const [selectWarehouseOptions, setSelectWarehouseOptions] = useState<any>([])
  const [errorMessageStockMinLevel, setErrorMessageStockMinLevel] =
    useState<any>('')
  const [reviewProductSwitchMessage, setReviewProducSwitchMessage] =
    useState<string>('')
  const [localeIsNotSupportedMessage, setLocaleIsNotSupportedMessage] =
    useState<string>('')
  const [invalidCredentialMessage, setInvalidCredentialMessage] =
    useState<string>('')
  const [isDisabledIntegrateButton, setIsDisabledIntegrateButton] =
    useState<boolean>(false)
  const [integration, setIntegration] = useState<IIntegration | null>(null)
  const [isShouldGetIntegrationInfo, setIsShouldGetIntegrationInfo] =
    useState<boolean>(false)
  const [shopUrl, setShopUrl] = useState<string>('')
  const [shopUrlErrorMessage, setShopUrlErrorMessage] = useState<string>('')
  const [errorMessages, setErrorMessages] = useState<ValidationError>({
    accessToken: '',
    clientId: '',
    clientSecret: '',
    consumerKey: '',
    consumerSecret: '',
    shopUrl: '',
    storeHash: '',
  })
  const [isShouldShopUrlValidate, setIsShouldShopUrlValidate] =
    useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>('')
  const [accessTokenErrorMessage, setAccessTokenErrorMessage] =
    useState<string>('')
  const [isShouldAccessTokenValidate, setIsShouldAccessTokenValidate] =
    useState<boolean>(false)
  const [tikTokIntegrationErrMessage, setTikTokIntegrationErrMessage] =
    useState<string>('')
  const [initialShopUrl, setInitialShopUrl] = useState<string>('')
  const [initialAccessToken, setInitialAccessToken] = useState<string>('')
  const [countIntegrationInfoChange, setCountIntegrationInfoChange] =
    useState<number>(0)
  const [isShouldGoBackToList, setIsShouldGoBackToList] = useState<boolean>(false)
  const [returnRelationshipId, setReturnRealtionshipId] = useState<null | string>(null)

  const [magentoInformation, setMagentoInformation] =
    useState<IMagentoInformation>({
      accessToken: '',
      shopUrl: '',
    })

  const [bigCommerceInformation, setBigCommerceInformation] =
    useState<IBigCommerceInformation>({
      accessToken: '',
      clientId: '',
      clientSecret: '',
      storeHash: '',
    })

  const [wooCommerceInformation, setWooCommerceInformation] =
    useState<IWooCommerceInformation>({
      consumerKey: '',
      consumerSecret: '',
      shopUrl: '',
    })

  const handleValidation = (
    data: IFormMarketplaceRelationship,
    validErrors: IMarketplaceRelationshipErrors
  ) => {
    if (!data.organizationId) {
      validErrors.organizationId = t('form_validate_required')
    }
    if (!data.siteId) {
      validErrors.siteId = t('form_validate_required')
    }

    if (!data.siteLocaleId) {
      validErrors.siteLocaleId = t('form_validate_required')
    }

    if (!data.marketplaceId) {
      validErrors.marketplaceId = t('form_validate_required')
    }

    if (!data.sellingPriceAdjustment && data.sellingPriceAdjustment !== 0) {
      validErrors.marketplaceId = t('form_validate_required')
    }

    if (!data.warehouseIds || _.isEmpty(data.warehouseIds)) {
      validErrors.warehouseIds = t('form_validate_required')
    }

    if (data.stockMinimumLevel === '' || data.stockMinimumLevel === null) {
      validErrors.stockMinimumLevel = t('form_validate_required')
    }
  }

  const handleValidationWithCredential = (
    data: IFormMarketplaceRelationship,
    validErrors: IMarketplaceRelationshipErrors,
    credentialType: 'clientId' | 'clientSecret' | 'sellerId' | 'refreshToken'
  ) => {
    if (
      (!marketplaceRelationshipsId &&
        selectedMarketplace &&
        selectedMarketplace.marketplaceTypeName === 'Amazon' &&
        !data[credentialType]) ||
      (marketplaceRelationshipsId &&
        integrationType === 'Amazon' &&
        !data[credentialType])
    ) {
      validErrors[credentialType] = t('form_validate_required')
    }
  }

  const handleBadRequestError = (_err: any) => {
    if (_err.response.data.message === 'Invalid seller account credentials') {
      setInvalidCredentialMessage(invalidCredentialMessage)
    }
    if (
      _err.response.data.message ===
      'This locale is not supported by this marketplace'
    ) {
      setFieldError(
        'siteLocaleId',
        t('marketplace_relationships_details_locale_is_not_supported_message')
      )
      setLocaleIsNotSupportedMessage(
        t('marketplace_relationships_details_locale_is_not_supported_message')
      )
    } else handleErrorResponse(_err)
  }

  const {
    dataApi: {defaultPagination},
  } = usePagination()

  const {
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldError,
    setFieldValue,
    setFieldTouched,
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    resetForm,
  } = useFormik<IFormMarketplaceRelationship>({
    initialValues: defaultBaseMarketplaceRelationship,
    onSubmit: (data) => {
      const {sellerId, clientId, clientSecret, refreshToken} = data
      const onHandleErrorMessage = (err: any) => {
        if (err.response.data.status === CONFLICT_ERROR) {
          handleConflictError(err)
          return
        }
        if (err.response.data.status === BAD_REQUEST_ERROR) {
          handleBadRequestError(err)
          return
        }
      }
      const requestData: IFormRequestMarketplaceRelationship = {
        ..._.omit(data, [
          'siteId',
          'sellerId',
          'clientId',
          'clientSecret',
          'refreshToken',
        ]),
        stockMinimumLevel: Number(data.stockMinimumLevel),
        sellingPriceAdjustment: Number(data.sellingPriceAdjustment),
        sellerAccount:
          integrationType === 'Amazon' ||
          (!marketplaceRelationshipsId &&
            selectedMarketplace &&
            selectedMarketplace.marketplaceTypeName === 'Amazon')
            ? {
                sellerId,
                clientId,
                clientSecret,
                refreshToken,
              }
            : null,
      }
      setSubmitting(true)
      !marketplaceRelationshipsId &&
        new MarketplaceRelationshipService(axiosClient)
          .addMarketplaceRelationship(requestData)
          .then((response: any) => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            showSuccessToast('toast_success_added_marketplace_relationship')
            setIsShouldGoBackToList(true)
            setReturnRealtionshipId(response.data.id)
          })
          .catch((err: any) => {
            setSubmitting(false)
            onHandleErrorMessage(err)
          })

      marketplaceRelationshipsId &&
        new MarketplaceRelationshipService(axiosClient)
          .editMarketplaceRelationship(marketplaceRelationshipsId, requestData)
          .then(() => {
            setSubmitting(true)
            setIsSubmitSuccess(true)
            showSuccessToast('toast_success_modified')
            setIsShouldGoBackToList(true)
          })
          .catch((err: any) => {
            setSubmitting(false)
            handleErrorResponse(err, concurrentHandling)
            onHandleErrorMessage(err)
          })
    },
    validate: (data: IFormMarketplaceRelationship) => {
      let validErrors: IMarketplaceRelationshipErrors = {}
      handleValidation(data, validErrors)

      handleValidationWithCredential(data, validErrors, 'clientId')
      handleValidationWithCredential(data, validErrors, 'clientSecret')
      handleValidationWithCredential(data, validErrors, 'sellerId')
      handleValidationWithCredential(data, validErrors, 'refreshToken')

      return validErrors
    },
  })

  const isFormFieldValid = (name: keyof IFormMarketplaceRelationship) => {
    return !!(touched[name] && errors[name])
  }

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name')
    setValues({...values, [attribute]: event.target.value.trim()})
  }

  const formatInputSwitch = (event: any) => {
    if (event.target.name === 'status') {
      setValues({
        ...values,
        status: Boolean(event.target.value) ? 'ACTIVE' : 'INACTIVE',
      })
    }

    if (event.target.name === 'isProductsReviewedBeforeListing') {
      setValues({
        ...values,
        isProductsReviewedBeforeListing: event.target.value,
      })
    }
  }

  const getFormErrorMessage = (name: keyof IFormMarketplaceRelationship) => {
    return (
      isFormFieldValid(name) &&
      !values[name] && (
        <Col xs={{span: 8, offset: 4}} className='py-0'>
          <small className='p-error text-sm'>{errors[name]}</small>
        </Col>
      )
    )
  }

  const showSuccessToast = (detail: string) => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t(detail),
      life: 5000,
    })
  }

  const onSelectChange = (
    selectedValue: any,
    fieldName: Omit<keyof IFormMarketplaceRelationship, 'status' | 'version'>
  ) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    invalidCredentialMessage !== '' && setInvalidCredentialMessage('')
    localeIsNotSupportedMessage !== '' && setLocaleIsNotSupportedMessage('')
    switch (fieldName) {
      case 'marketplaceId':
        setSelectedMarketplace(selectedValue)
        setFieldValue('marketplaceId', selectedValue.value)
        break
      case 'organizationId':
        setSelectedOrganization(selectedValue)
        setSelectedSite(null)
        setSelectedLocale(null)
        setFieldValue('siteId', '')
        setFieldValue('organizationId', selectedValue.value)
        break
      case 'siteId':
        setSelectedSite(selectedValue)
        setSelectedLocale(null)
        setFieldValue('siteLocaleId', '')
        setFieldValue('siteId', selectedValue.value)
        break
      case 'siteLocaleId':
        setSelectedLocale(selectedValue)
        setFieldValue('siteLocaleId', selectedValue.value)
        break
      case 'warehouseIds':
        setTimeout(() => {
          setSelectedWarehouses(selectedValue)
          setFieldValue(
            'warehouseIds',
            selectedValue.map((item: any) => item.value)
          )
        }, 0)
        break
      default:
    }
  }

  const onHandleInputChange = (e: any) => {
    invalidCredentialMessage !== '' && setInvalidCredentialMessage('')
    localeIsNotSupportedMessage !== '' && setLocaleIsNotSupportedMessage('')
    onInputChange(e)
  }

  const onSelectBlur = (e: any, fieldName: string) => {
    setFieldTouched(fieldName, true)
    handleBlur(e.nativeEvent)
  }

  const onInputBlur = (e: any) => {
    const {name, value} = e.target
    if (Number(value) < 0) {
      if (name === 'stockMinimumLevel') {
        setFieldError(
          'stockMinimumLevel',
          t('form_validate_positive_number_stock_minimum_level')
        )
        setErrorMessageStockMinLevel(
          t('form_validate_positive_number_stock_minimum_level')
        )
      }
    } else {
      if (name === 'stockMinimumLevel') {
        setErrorMessageStockMinLevel('')
      }
    }
    handleBlur(e)
    formatInput(e)
  }

  const onHandleSubmit = () => {
    handleSubmit()
  }

  const handleChangeMagentoInformation = (
    e: any,
    field: keyof IMagentoInformation
  ) => {
    setCountIntegrationInfoChange(countIntegrationInfoChange + 1)
    setErrorMessages((oldErrorMessage) => ({
      ...oldErrorMessage,
      [field]: '',
    }))
    setMagentoInformation({
      ...magentoInformation,
      [field]: e.target.value,
    })
  }

  const handleBlurMagentoInformation = (
    e: any,
    field: keyof IMagentoInformation
  ) => {
    setMagentoInformation({
      ...magentoInformation,
      [field]: e.target.value.trim().toLowerCase(),
    })
  }

  const handleChangeBigCommerceInformation = (
    e: any,
    field: keyof IBigCommerceInformation
  ) => {
    setCountIntegrationInfoChange(countIntegrationInfoChange + 1)
    setErrorMessages((oldErrorMessage) => ({
      ...oldErrorMessage,
      [field]: '',
    }))
    setBigCommerceInformation({
      ...bigCommerceInformation,
      [field]: e.target.value,
    })
  }

  const handleBlurBigCommerceInformation = (
    e: any,
    field: keyof IBigCommerceInformation
  ) => {
    setBigCommerceInformation({
      ...bigCommerceInformation,
      [field]: e.target.value.trim().toLowerCase(),
    })
  }

  const handleChangeWooCommerceInformation = (
    e: any,
    field: keyof IWooCommerceInformation
  ) => {
    setCountIntegrationInfoChange(countIntegrationInfoChange + 1)
    setErrorMessages((oldErrorMessage) => ({
      ...oldErrorMessage,
      [field]: '',
    }))
    setWooCommerceInformation({
      ...wooCommerceInformation,
      [field]: e.target.value,
    })
  }

  const handleBlurWooCommerceInformation = (
    e: any,
    field: keyof IWooCommerceInformation
  ) => {
    setWooCommerceInformation({
      ...wooCommerceInformation,
      [field]: e.target.value.trim().toLowerCase(),
    })
  }

  const getErrorMessageByField = (field: keyof ValidationError) => {
    return errorMessages[field]
  }

  const handleChangeShopUrlShopify = (e: any) => {
    setCountIntegrationInfoChange(countIntegrationInfoChange + 1)
    setShopUrlErrorMessage('')
    setShopUrl(e.target.value)
  }

  const handleBlurShopUrlShopify = (e: any) => {
    setShopUrl(e.target.value.trim().toLowerCase())
  }

  const handleChangeAccessTokenShopify = (e: any) => {
    setCountIntegrationInfoChange(countIntegrationInfoChange + 1)
    setIsShouldAccessTokenValidate(false)
    setAccessToken(e.target.value.trim())
    setAccessTokenErrorMessage('')
  }

  const handleGetHostName = () => {
    if (window.location.hostname.includes('localhost')) {
      return 'https://localhost:3000/marketplace-integration'
    } else return `https://${window.location.hostname}/marketplace-integration`
  }

  const handleIntegrateWithTiktok = async () => {
    const tikTokIntegrateState = `tiktok-${uuidv4()}`
    localStorage.setItem(
      MARKETPLACE_INTEGRATION_STATE_KEY,
      tikTokIntegrateState
    )
    const {
      data: {appKey, authUrl},
    } = await new TiktokService(axiosClient).getAppKey()
    if (!appKey) {
      localStorage.removeItem(MARKETPLACE_INTEGRATION_STATE_KEY)
      return
    }
    setNewWindowObj({
      url: `${authUrl}?app_key=${appKey}&state=${tikTokIntegrateState}`,
      name: 'tiktok',
      title: 'tiktok',
    })
    setIsWindowOpen(true)
  }

  const handleErrorMessageWithAccessToken = () => {
    setErrorMessages((oldErrorMessage) => ({
      ...oldErrorMessage,
      accessToken: t(
        'marketplace_relationships_accessToken_error_empty_message'
      ),
    }))
  }

  const handleIntegrateWithShopify = async () => {
    setIsShouldShopUrlValidate(true)
    setIsShouldAccessTokenValidate(true)
    if (!shopUrl || !/.*\.myshopify.com$/.test(shopUrl) || !accessToken) {
      !shopUrl &&
        setShopUrlErrorMessage(
          t('marketplace_relationships_shopUrl_empty_message')
        )
      shopUrl &&
        !/.*\.myshopify.com$/.test(shopUrl) &&
        setShopUrlErrorMessage(
          t('marketplace_relationships_shopUrl_error_domain_message')
        )
      !accessToken &&
        setAccessTokenErrorMessage(
          t('marketplace_relationships_accessToken_error_empty_message')
        )
      return
    }

    if (shopifyIntegrationAppType === 'public') {
      const shopifyIntegrateState = `shopify-${uuidv4()}`
      localStorage.setItem(
        MARKETPLACE_INTEGRATION_STATE_KEY,
        shopifyIntegrateState
      )
      const {
        data: {appKey},
      } = await new ShopifyService(axiosClient).getAppKey()
      const scope =
        'read_locations,write_assigned_fulfillment_orders,write_inventory,write_merchant_managed_fulfillment_orders,write_orders,read_orders,write_products,write_third_party_fulfillment_orders'
      setNewWindowObj({
        url: `https://${shopUrl}/admin/oauth/authorize?client_id=${appKey}&scope=${scope}&redirect_uri=${handleGetHostName()}&state=${shopifyIntegrateState}`,
        name: 'shopify',
        title: 'shopify',
      })
      setIsWindowOpen(true)
    }

    if (shopifyIntegrationAppType === 'custom') {
      setCountIntegrateWithCustomApp(countIntegrateWithCustomApp + 1)
    }
  }

  const handleIntegrateWithMagento = async () => {
    let isValidInformation = true
    if (!magentoInformation.shopUrl) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        shopUrl: t('marketplace_relationships_shopUrl_empty_message'),
      }))
      isValidInformation = false
    }

    if (!magentoInformation.accessToken) {
      handleErrorMessageWithAccessToken()
      isValidInformation = false
    }
    if (!isValidInformation) {
      return
    }

    await handleMagentoIntegrate({
      accessToken: magentoInformation.accessToken,
      localeMarketplaceId: localeMarketplaceId ?? '',
      shopDomain: magentoInformation.shopUrl,
    })
  }

  const handleIntegrateWithBigCommerce = async () => {
    let isValidInformation = true
    if (!bigCommerceInformation.clientId) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        clientId: t('marketplace_relationships_client_id_error_empty_message'),
      }))
      isValidInformation = false
    }

    if (!bigCommerceInformation.clientSecret) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        clientSecret: t(
          'marketplace_relationships_client_secret_error_empty_message'
        ),
      }))
      isValidInformation = false
    }

    if (!bigCommerceInformation.storeHash) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        storeHash: t(
          'marketplace_relationships_store_hash_error_empty_message'
        ),
      }))
      isValidInformation = false
    }

    if (!bigCommerceInformation.accessToken) {
      handleErrorMessageWithAccessToken()
      isValidInformation = false
    }

    if (!isValidInformation) {
      return
    }

    await handleBigCommerceIntegrate({
      accessToken: bigCommerceInformation.accessToken,
      localeMarketplaceId: localeMarketplaceId ?? '',
      clientId: bigCommerceInformation.clientId,
      clientSecret: bigCommerceInformation.clientSecret,
      storeHash: bigCommerceInformation.storeHash,
    })
  }

  const handleIntegrateWithWooCommerce = async () => {
    let isValidInformation = true
    if (!wooCommerceInformation.shopUrl) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        shopUrl: t('marketplace_relationships_shopUrl_empty_message'),
      }))
      isValidInformation = false
    }
    if (!wooCommerceInformation.consumerKey) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        consumerKey: t(
          'marketplace_relationships_consumer_key_error_empty_message'
        ),
      }))
      isValidInformation = false
    }
    if (!wooCommerceInformation.consumerSecret) {
      setErrorMessages((oldErrorMessage) => ({
        ...oldErrorMessage,
        consumerSecret: t(
          'marketplace_relationships_consumer_secret_error_empty_message'
        ),
      }))
      isValidInformation = false
    }

    if (!isValidInformation) {
      return
    }
    await handleWooCommerceIntegrate({
      localeMarketplaceId: localeMarketplaceId ?? '',
      consumerKey: wooCommerceInformation.consumerKey,
      consumerSecret: wooCommerceInformation.consumerSecret,
      storeUrl: wooCommerceInformation.shopUrl,
    })
  }

  const handleIntegration = async (_integrationType: IntegrationType) => {
    switch (_integrationType) {
      case 'Tiktok': {
        handleIntegrateWithTiktok()
        break
      }

      case 'Shopify': {
        handleIntegrateWithShopify()
        break
      }

      case 'Magento': {
        handleIntegrateWithMagento()
        break
      }

      case 'BigCommerce': {
        handleIntegrateWithBigCommerce()
        break
      }

      case 'WooCommerce': {
        handleIntegrateWithWooCommerce()
        break
      }

      case 'Amazon':
        return

      default:
        return
    }
  }

  const handleConflictError = (err: any) => {
    err.response.data.invalidFields.forEach((invalidField: any) => {
      switch (invalidField.errorMessage) {
        case 'StockMinimumLevel must be positive': {
          setFieldError(
            'stockMinLevel',
            t('form_validate_positive_number_stock_minimum_level')
          )
          break
        }
      }
    })
  }

  const handleOpenNewWindow = () => {
    setIsDisabledIntegrateButton(true)
  }

  const handleUnLoadNewWindow = () => {
    setIsDisabledIntegrateButton(false)
    setIsWindowOpen(false)
    setIntegration(getIntegrationInfoFromLocal())
  }

  const handleBackToList = () => {
    navigate(-1)
  }

  const handleBackToEditRelationship = (marketplaceRelationshipId: string) => {
    navigate(
      ROUTE_MARKETPLACE_RELATIONSHIP.EDIT.replace(
        ROUTE_PARAMS.MARKETPLACE_RELATIONSHIP_ID,
        marketplaceRelationshipId
      )
    )
  }

  const concurrentHandling = () => {
    confirmDialog({
      message: t('form_concurrent_user'),
      header: <DialogTemplate />,
      acceptClassName: 'btn btn-success',
      rejectClassName: 'icon-hide',
      acceptLabel: 'OK',
      position: 'top',
      accept: () => getMarketplaceRelationships(),
    })
  }

  const getMarketplaceRelationships = () => {
    marketplaceRelationshipsId &&
      new MarketplaceRelationshipService(axiosClient)
        .getRelationshipById(marketplaceRelationshipsId)
        .then((response: AxiosResponse<IUpdateMarketplaceRelationship>) => {
          const marketplaceRelationshipData = response.data
          resetForm({
            values: {
              organizationId: marketplaceRelationshipData.organization.id,
              siteId: marketplaceRelationshipData.site.id,
              siteLocaleId: marketplaceRelationshipData.siteLocale.id,
              marketplaceId: marketplaceRelationshipData.marketplace.id,
              warehouseIds: marketplaceRelationshipData.organizationWarehouse
                ? marketplaceRelationshipData.organizationWarehouse.map(
                    (item: any) => item.id
                  )
                : [],
              stockMinimumLevel: Number(
                marketplaceRelationshipData.stockMinimumLevel
              ),
              sellingPriceAdjustment: Number(
                marketplaceRelationshipData.sellingPriceAdjustment
              ),
              isProductsReviewedBeforeListing:
                marketplaceRelationshipData.isProductsReviewedBeforeListing,
              status: marketplaceRelationshipData.status,
              version: marketplaceRelationshipData.version,
              aggregatorId: marketplaceRelationshipData.aggregatorId,
              clientId: marketplaceRelationshipData.sellerAccount
                ? marketplaceRelationshipData.sellerAccount.clientId
                : '',
              clientSecret: marketplaceRelationshipData.sellerAccount
                ? marketplaceRelationshipData.sellerAccount.clientSecret
                : '',
              sellerId: marketplaceRelationshipData.sellerAccount
                ? marketplaceRelationshipData.sellerAccount.sellerId
                : '',
              refreshToken: marketplaceRelationshipData.sellerAccount
                ? marketplaceRelationshipData.sellerAccount.refreshToken
                : '',
            },
          })
          setSelectedMarketplaceRelationshipId({
            label: marketplaceRelationshipData.id,
            value: marketplaceRelationshipData.id,
          })
          setSelectedOrganization({
            label: marketplaceRelationshipData.organization.name,
            value: marketplaceRelationshipData.organization.id,
          })
          setSelectedSite({
            label: marketplaceRelationshipData.site.name,
            value: marketplaceRelationshipData.site.id,
          })
          setSelectedLocale({
            label: marketplaceRelationshipData.siteLocale.name,
            value: marketplaceRelationshipData.siteLocale.id,
          })
          setSelectedMarketplace({
            label: marketplaceRelationshipData.marketplace.name,
            value: marketplaceRelationshipData.marketplace.id,
          })
          setSelectedWarehouses(
            marketplaceRelationshipData.organizationWarehouse.map(
              (item: any) => ({
                label: item.name,
                value: item.id,
              })
            )
          )
          setIntegrationType(marketplaceRelationshipData.marketplaceType.name)
          setLocaleMarketplaceId(marketplaceRelationshipData.id)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
  }

  const handleDisplayIntegration = (response: any) => {
    if (response && response.data && response.data.isIntegrated) {
      setIsShouldIntegrationSuccessDisplay(true)
    } else {
      setIsShouldIntegrationSuccessDisplay(false)
    }
  }

  const transformIntegratedShopUrlResponse = (response: any) =>
    response.data.shopDomain && response.data.shopDomain !== 'null'
      ? `${response.data.shopDomain}.myshopify.com`
      : ''

  const transformIntegratedAccessTokenResponse = (response: any) =>
    response.data.accessToken && response.data.accessToken !== 'null'
      ? response.data.accessToken
      : ''

  const handleGetIntegrationInfoWithTikTok = async (_localeMarketplaceId: string) => {
    try {
      const response = await new TiktokService(axiosClient).getIntegrationInfo(_localeMarketplaceId)
      handleDisplayIntegration(response)
    } catch(err: any) {
      handleErrorResponse(err)
    }
  }

  const handleGetIntegrationInfoWithShopify = async(_localeMarketplaceId: string) => {
    try {
      const response = await new ShopifyService(axiosClient).getIntegrationInfo(
        _localeMarketplaceId
      )
      handleDisplayIntegration(response)
      if (response.data.isIntegrated) {
        setShopUrl(transformIntegratedShopUrlResponse(response))
        setInitialShopUrl(transformIntegratedShopUrlResponse(response))
        setAccessToken(transformIntegratedAccessTokenResponse(response))
        setInitialAccessToken(transformIntegratedAccessTokenResponse(response))
      }
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const handleGetIntegrationInfoWithMagento = async (_localeMarketplaceId: string) => {
    try {
      const response = await new MarketplaceIntegrationService(
        axiosClient
      ).getMagentoIntegrationInformation(_localeMarketplaceId)
      handleDisplayIntegration(response)
      if (response.data.isIntegrated) {
        setMagentoInformation({
          accessToken: response.data.accessToken,
          shopUrl: response.data.shopDomain,
        })
      }
    } catch (err: any) {
      handleErrorResponse(err)
    }
  }

  const handleGetIntegrationInfoWithBigCommerce = async (_localeMarketplaceId: string) => {
    try {
      const response = await new MarketplaceIntegrationService(
        axiosClient
      ).getBigCommerceIntegrationInformation(_localeMarketplaceId)
      handleDisplayIntegration(response)
      if (response.data.isIntegrated) {
        setBigCommerceInformation({
          accessToken: response.data.accessToken,
          clientId: response.data.clientId,
          clientSecret: response.data.clientSecret,
          storeHash: response.data.storeHash,
        })
      }
    } catch(err: any) {
      handleErrorResponse(err)
    }
  }

  const handleGetIntegrationInfoWithWooCommerce = async(_localeMarketplaceId: string) => {
    try {
      const response = await new MarketplaceIntegrationService(
        axiosClient
      ).getWooCommerceIntegrationInformation(_localeMarketplaceId)
      handleDisplayIntegration(response)
      if (response.data.isIntegrated) {
        setWooCommerceInformation({
          consumerKey: response.data.consumerKey,
          consumerSecret: response.data.consumerSecret,
          shopUrl: response.data.storeUrl,
        })
      }
    } catch(err: any) {
      handleErrorResponse(err)
    }
  }
      
  const getIntegrationInfo = () => {
    switch (integrationType) {
      case 'Tiktok': {
        localeMarketplaceId &&
          handleGetIntegrationInfoWithTikTok(localeMarketplaceId)
        break
      }
      case 'Shopify': {
        localeMarketplaceId && handleGetIntegrationInfoWithShopify(localeMarketplaceId)
        break
      }
      case 'Magento': {
        localeMarketplaceId && handleGetIntegrationInfoWithMagento(localeMarketplaceId)
        break
      }
      case 'BigCommerce': {
        localeMarketplaceId && handleGetIntegrationInfoWithBigCommerce(localeMarketplaceId)
        break
      }
      case 'WooCommerce': {
        localeMarketplaceId && handleGetIntegrationInfoWithWooCommerce(localeMarketplaceId)
        break
      }
    }
  }

  const handleIntegrationError = (err: any, _auth: any) => {
    setIsShouldGetIntegrationInfo(false)
    setIsShouldIntegrationSuccessDisplay(false)
    if (err.response.data && err.response.data.status === BAD_REQUEST_ERROR) {
      if (err.response.data.errorCode === 'SHOPIFY_DOMAIN_HAS_INTEGRATED') {
        setShopUrlErrorMessage(
          t('marketplace_relationships_shopUrl_error_duplicate_message')
        )
      } else if (
        err.response.data.errorCode === 'MAGENTO_DOMAIN_HAS_INTEGRATED' ||
        err.response.data.errorCode === 'WOOCOMMERCE_DOMAIN_HAS_INTEGRATED'
      ) {
        setErrorMessages((oldErrorMessages) => ({
          ...oldErrorMessages,
          shopUrl: t(
            'marketplace_relationships_shopUrl_error_duplicate_message'
          ),
        }))
      } else if (
        err.response.data.errorCode === 'BIGCOMMERCE_STORE_HASH_EXISTED'
      ) {
        setErrorMessages((oldErrorMessages) => ({
          ...oldErrorMessages,
          storeHash: t(
            'marketplace_relationships_store_hash_error_duplicate_message'
          ),
        }))
      } else if (
        err.response.data.errorCode === 'TIKTOK_DEFAULT_WAREHOUSE_NOT_SET'
      ) {
        setTikTokIntegrationErrMessage(
          t('marketplace_relationships_default_warehouse_not_set_error_message')
        )
      } else if (
        err.response.data.errorCode === 'SHOPIFY_ACCESS_TOKEN_INVALID'
      ) {
        setAccessTokenErrorMessage(
          t(
            'marketplace_relationships_accessToken_error_integrate_fail_message'
          )
        )
      }
    } else {
      handleErrorResponse(err)
    }
  }

  const checkDisableSelectOption = () =>
    marketplaceRelationshipsId ? true : undefined

  const handleIntegratePublicAppShopifyApi = (authCode: string | null) => {
    if (localeMarketplaceId && authCode && shopUrl && accessToken) {
      if (shopUrlErrorMessage || accessTokenErrorMessage) {
        return
      }
      if (shopifyIntegrationAppType === 'public') {
        new ShopifyService(axiosClient)
          .integrateWithPublicApp({
            localeMarketplaceId,
            authCode,
            shopDomain: shopUrl,
          })
          .then(() => {
            setIsShouldGetIntegrationInfo(true)
          })
          .catch((err: any) => {
            handleIntegrationError(err, auth)
          })
      }
    }
  }

  const renderShopUrlShopifySection = () => {
    return (
      <>
        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='shopUrl'
              className={classNames('required', {
                'p-error':
                  isShouldShopUrlValidate && !_.isEmpty(shopUrlErrorMessage),
              })}
            >
              {t('marketplace_relationships_details_shop_url')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='shopUrl'
              name='shopUrl'
              value={shopUrl}
              onChange={handleChangeShopUrlShopify}
              onBlur={handleBlurShopUrlShopify}
              className={classNames('w-full p-1', {
                'p-invalid':
                  isShouldShopUrlValidate && !_.isEmpty(shopUrlErrorMessage),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>{shopUrlErrorMessage}</small>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const renderAcessTokenShopifySection = () => {
    return (
      <>
        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='accessToken'
              className={classNames('required', {
                'p-error':
                  isShouldAccessTokenValidate &&
                  !_.isEmpty(accessTokenErrorMessage),
              })}
            >
              {t('marketplace_relationships_details_access_token')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='accessToken'
              name='accessToken'
              value={accessToken}
              onChange={handleChangeAccessTokenShopify}
              className={classNames('w-full p-1', {
                'p-invalid':
                  isShouldAccessTokenValidate &&
                  !_.isEmpty(accessTokenErrorMessage),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {accessTokenErrorMessage}
              </small>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const renderMagentoInformation = () => {
    return (
      <>
        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='shopUrl'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('shopUrl')),
              })}
            >
              {t('marketplace_relationships_details_shop_url')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='shopUrl'
              name='shopUrl'
              value={magentoInformation.shopUrl}
              onChange={(e) => handleChangeMagentoInformation(e, 'shopUrl')}
              onBlur={(e) => handleBlurMagentoInformation(e, 'shopUrl')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('shopUrl')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('shopUrl')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='accessToken'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('accessToken')),
              })}
            >
              {t('marketplace_relationships_details_access_token')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='accessToken'
              name='accessToken'
              value={magentoInformation.accessToken}
              onChange={(e) => handleChangeMagentoInformation(e, 'accessToken')}
              onBlur={(e) => handleBlurMagentoInformation(e, 'accessToken')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('accessToken')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('accessToken')}
              </small>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const renderBigCommerceInformation = () => {
    return (
      <>
        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='clientId'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('clientId')),
              })}
            >
              {t('marketplace_relationships_details_client_id')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='clientId'
              name='clientId'
              value={bigCommerceInformation.clientId}
              onChange={(e) =>
                handleChangeBigCommerceInformation(e, 'clientId')
              }
              onBlur={(e) => handleBlurBigCommerceInformation(e, 'clientId')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('clientId')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('clientId')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='clientSecret'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('clientSecret')),
              })}
            >
              {t('marketplace_relationships_details_client_secret')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='clientSecret'
              name='clientSecret'
              value={bigCommerceInformation.clientSecret}
              onChange={(e) =>
                handleChangeBigCommerceInformation(e, 'clientSecret')
              }
              onBlur={(e) =>
                handleBlurBigCommerceInformation(e, 'clientSecret')
              }
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('clientSecret')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('clientSecret')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='storeHash'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('storeHash')),
              })}
            >
              {t('marketplace_relationships_details_store_hash')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='storeHash'
              name='storeHash'
              value={bigCommerceInformation.storeHash}
              onChange={(e) =>
                handleChangeBigCommerceInformation(e, 'storeHash')
              }
              onBlur={(e) => handleBlurBigCommerceInformation(e, 'storeHash')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('storeHash')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('storeHash')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='accessToken'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('accessToken')),
              })}
            >
              {t('marketplace_relationships_details_access_token')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='accessToken'
              name='accessToken'
              value={bigCommerceInformation.accessToken}
              onChange={(e) =>
                handleChangeBigCommerceInformation(e, 'accessToken')
              }
              onBlur={(e) => handleBlurBigCommerceInformation(e, 'accessToken')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('accessToken')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('accessToken')}
              </small>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const renderWooCommerceInformation = () => {
    return (
      <>
        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='shopUrl'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('shopUrl')),
              })}
            >
              {t('marketplace_relationships_details_shop_url')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='shopUrl'
              name='shopUrl'
              value={wooCommerceInformation.shopUrl}
              onChange={(e) => handleChangeWooCommerceInformation(e, 'shopUrl')}
              onBlur={(e) => handleBlurWooCommerceInformation(e, 'shopUrl')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('shopUrl')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('shopUrl')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='consumerKey'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('consumerKey')),
              })}
            >
              {t('marketplace_relationships_details_consumer_key')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='consumerKey'
              name='consumerKey'
              value={wooCommerceInformation.consumerKey}
              onChange={(e) =>
                handleChangeWooCommerceInformation(e, 'consumerKey')
              }
              onBlur={(e) => handleBlurWooCommerceInformation(e, 'consumerKey')}
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(getErrorMessageByField('consumerKey')),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('consumerKey')}
              </small>
            </div>
          </Col>
        </Row>

        <Row className='align-items-center py-1'>
          <Col xs={4}>
            <label
              htmlFor='consumerSecret'
              className={classNames('required', {
                'p-error': !_.isEmpty(getErrorMessageByField('consumerSecret')),
              })}
            >
              {t('marketplace_relationships_details_consumer_secret')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <InputText
              id='consumerSecret'
              name='consumerSecret'
              value={wooCommerceInformation.consumerSecret}
              onChange={(e) =>
                handleChangeWooCommerceInformation(e, 'consumerSecret')
              }
              onBlur={(e) =>
                handleBlurWooCommerceInformation(e, 'consumerSecret')
              }
              className={classNames('w-full p-1', {
                'p-invalid': !_.isEmpty(
                  getErrorMessageByField('consumerSecret')
                ),
              })}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}></Col>
          <Col xs={8}>
            <div className='col-8 col-offset-4 py-0'>
              <small className='p-error text-sm'>
                {getErrorMessageByField('consumerSecret')}
              </small>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const renderControlsByIntegrationType = (
    _integrationType: IntegrationType
  ) => {
    if (marketplaceRelationshipsId) {
      switch (_integrationType) {
        case 'Amazon':
          return null
        case 'Shopify': {
          return (
            <>
              {renderShopUrlShopifySection()}
              {renderAcessTokenShopifySection()}
            </>
          )
        }
        case 'Magento': {
          return renderMagentoInformation()
        }

        case 'BigCommerce': {
          return renderBigCommerceInformation()
        }

        case 'WooCommerce': {
          return renderWooCommerceInformation()
        }

        default:
          return null
      }
    }
    return null
  }

  const handleMagentoIntegrate = async (info: IMagentoIntegration) => {
    try {
      await new MarketplaceIntegrationService(axiosClient).integrateMagento(
        info
      )
      setIsShouldGetIntegrationInfo(true)
    } catch (err) {
      handleIntegrationError(err, auth)
    }
  }

  const handleBigCommerceIntegrate = async (info: IBigCommerceIntegration) => {
    try {
      await new MarketplaceIntegrationService(axiosClient).integrateBigCommerce(
        info
      )
      setIsShouldGetIntegrationInfo(true)
    } catch (err) {
      handleIntegrationError(err, auth)
    }
  }

  const handleWooCommerceIntegrate = async (info: IWooCommerceIntegration) => {
    try {
      await new MarketplaceIntegrationService(axiosClient).integrateWooCommerce(
        info
      )
      setIsShouldGetIntegrationInfo(true)
    } catch (err) {
      handleIntegrationError(err, auth)
    }
  }

  const renderConnectButton = () => {
    if (
      marketplaceRelationshipsId &&
      (integrationType === 'Tiktok' ||
        integrationType === 'Shopify' ||
        integrationType === 'Magento' ||
        integrationType === 'BigCommerce' ||
        integrationType === 'WooCommerce')
    ) {
      return (
        <>
          <br />
          <Row>
            <Col xs={4}></Col>
            <Col xs={8} className='p-fluid d-flex justify-content-start'>
              <Button
                variant='info'
                className='me-2'
                onClick={() => handleIntegration(integrationType)}
                disabled={isDisabledIntegrateButton}
              >
                {t('common_button_integrate')}
              </Button>
              {tikTokIntegrationErrMessage && (
                <div className='d-flex align-items-center'>
                  <span>{tikTokIntegrationErrMessage}</span>
                </div>
              )}
              {isShouldIntegrationSuccessDisplay && (
                <div className='d-flex align-items-center'>
                  <div className='dripicon-integration-container ms-1 me-2'>
                    <i className='dripicons-checkmark dripicon-integrate-success'></i>
                  </div>
                  <span>
                    {t('marketplace_relationships_integration_success_message')}
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </>
      )
    } else return null
  }

  const renderCredentialSection = () => {
    if (
      (marketplaceRelationshipsId && integrationType === 'Amazon') ||
      (!marketplaceRelationshipsId &&
        selectedMarketplace &&
        selectedMarketplace.marketplaceTypeName &&
        selectedMarketplace.marketplaceTypeName === 'Amazon')
    ) {
      return (
        <>
          <Row className='align-items-center'>
            <Col xs={12} className='mt-3'>
              <label htmlFor='additionalInformation' className='fs-4 fw-bold'>
                {t('marketplace_relationships_details_seller_account')}:
              </label>
            </Col>
          </Row>

          <Row className='align-items-center py-1'>
            <Col xs={4}>
              <label
                htmlFor='clientId'
                className={classNames('required', {
                  'p-error': isFormFieldValid('clientId'),
                })}
              >
                {t('marketplace_relationships_details_client_id')}
              </label>
            </Col>
            <Col xs={8} className='p-fluid'>
              <span className='p-input-icon-right p-sensitive-input-icon-right'>
                <i
                  className='pi pi-eye-slash'
                  onClick={() => {
                    toggleHidingInput(
                      inputsRef.current[0],
                      iconsRef.current[0],
                      'eyeSlash'
                    )
                  }}
                  ref={iconsRef.current[0]}
                />
                <InputText
                  type='password'
                  id='clientId'
                  name='clientId'
                  value={values.clientId}
                  onBlur={onInputBlur}
                  onChange={onHandleInputChange}
                  className={classNames('w-full p-1 p-sensitive-input', {
                    'p-invalid': isFormFieldValid('clientId'),
                  })}
                  maxLength={255}
                  ref={inputsRef.current[0]}
                  onCopy={(e) => {
                    e.preventDefault()
                    return false
                  }}
                />
              </span>
            </Col>
          </Row>
          <Row className='align-items-center py-1'>
            <Col xs={4}>
              <label
                htmlFor='clientSecret'
                className={classNames('required', {
                  'p-error': isFormFieldValid('clientSecret'),
                })}
              >
                {t('marketplace_relationships_details_client_secret')}
              </label>
            </Col>
            <Col xs={8} className='p-fluid'>
              <span className='p-input-icon-right p-sensitive-input-icon-right'>
                <i
                  className='pi pi-eye-slash'
                  onClick={() => {
                    toggleHidingInput(
                      inputsRef.current[1],
                      iconsRef.current[1],
                      'eyeSlash'
                    )
                  }}
                  ref={iconsRef.current[1]}
                />
                <InputText
                  type='password'
                  id='clientSecret'
                  name='clientSecret'
                  value={values.clientSecret}
                  onBlur={onInputBlur}
                  onChange={onHandleInputChange}
                  className={classNames('w-full p-1 p-sensitive-input', {
                    'p-invalid': isFormFieldValid('clientSecret'),
                  })}
                  maxLength={255}
                  ref={inputsRef.current[1]}
                  onCopy={(e) => {
                    e.preventDefault()
                    return false
                  }}
                />
              </span>
            </Col>
          </Row>
          <Row className='align-items-center py-1'>
            <Col xs={4}>
              <label
                htmlFor='sellerId'
                className={classNames('required', {
                  'p-error': isFormFieldValid('sellerId'),
                })}
              >
                {t('marketplace_relationships_details_seller_id')}
              </label>
            </Col>
            <Col xs={8} className='p-fluid'>
              <span className='p-input-icon-right p-sensitive-input-icon-right'>
                <i
                  className='pi pi-eye-slash'
                  onClick={() => {
                    toggleHidingInput(
                      inputsRef.current[2],
                      iconsRef.current[2],
                      'eyeSlash'
                    )
                  }}
                  ref={iconsRef.current[2]}
                />
                <InputText
                  type='password'
                  id='sellerId'
                  name='sellerId'
                  value={values.sellerId}
                  onBlur={onInputBlur}
                  onChange={onHandleInputChange}
                  className={classNames('w-full p-1 p-sensitive-input', {
                    'p-invalid': isFormFieldValid('sellerId'),
                  })}
                  maxLength={255}
                  ref={inputsRef.current[2]}
                />
              </span>
            </Col>
          </Row>
          <Row className='align-items-center py-1'>
            <Col xs={4}>
              <label
                htmlFor='refreshToken'
                className={classNames('required', {
                  'p-error': isFormFieldValid('refreshToken'),
                })}
              >
                {t('marketplace_relationships_details_refresh_token')}
              </label>
            </Col>
            <Col xs={8} className='p-fluid'>
              <span className='p-input-icon-right p-sensitive-input-icon-right'>
                <i
                  className='pi pi-eye-slash'
                  onClick={() => {
                    toggleHidingInput(
                      inputsRef.current[3],
                      iconsRef.current[3],
                      'eyeSlash'
                    )
                  }}
                  ref={iconsRef.current[3]}
                />
                <InputText
                  type='password'
                  id='refreshToken'
                  name='refreshToken'
                  value={values.refreshToken}
                  onBlur={onInputBlur}
                  onChange={onHandleInputChange}
                  className={classNames('w-full p-1 p-sensitive-input', {
                    'p-invalid': isFormFieldValid('refreshToken'),
                  })}
                  maxLength={500}
                  ref={inputsRef.current[3]}
                />
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={{span: 8, offset: 4}} className='py-0'>
              <small className='p-error text-sm'>
                {invalidCredentialMessage}
              </small>
            </Col>
          </Row>
        </>
      )
    } else return null
  }

  const checkIsDisabledButtonWithPermission = () =>
    (Boolean(marketplaceRelationshipsId) && checkHasPermissions &&
      !checkHasPermissions([PERMISSIONS.edit_marketplace_relationship]))
  
  useEffect(() => {
    if (marketplaceRelationshipsId) {
      getMarketplaceRelationships()
    }
  }, [marketplaceRelationshipsId])

  useEffect(() => {
    if (!marketplaceRelationshipsId) {
      new OrganizationService(axiosClient)
        .getAllOrganizations({...defaultPagination, rows: 2000})
        .then((response: any) => {
          setSelectOrganizationOptions(
            transformToSelectData(response.data.content)
          )
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(selectedOrganization) && !marketplaceRelationshipsId) {
      new SiteServices(axiosClient)
        .getSitesFromMultiOrganizations(
          {
            organizationIds: [selectedOrganization.value],
          },
          {
            ...defaultPagination,
            rows: 2000,
          }
        )
        .then((response: any) => {
          setSelectSiteOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [selectedOrganization])

  useEffect(() => {
    if (!isEmpty(selectedSite) && !marketplaceRelationshipsId) {
      new SiteLocaleService(axiosClient)
        .getLocalesFromMultiSites(
          {
            siteIds: [selectedSite.value],
          },
          {
            ...defaultPagination,
            rows: 2000,
          }
        )
        .then((response: any) => {
          setSelectLocaleOptions(transformToSelectData(response.data.content))
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [selectedSite])

  useEffect(() => {
    if (selectedOrganization && selectedLocale && !marketplaceRelationshipsId) {
      new MarketplaceService(axiosClient)
        .getUnAssignedMarketplaces({
          organizationId: selectedOrganization.value,
          siteLocaleId: selectedLocale.value,
          requiredHasAggregator: true,
        })
        .then((response) => {
          setSelectMarketplaceOptions(
            transformToSelectData(response.data, true)
          )
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [selectedOrganization, selectedLocale])

  useEffect(() => {
    if (!_.isEmpty(selectedOrganization)) {
      new WarehouseServices(axiosClient)
        .getWarehouseByFilter(
          {
            rows: 2000,
            page: 1,
            sortField: 'erpId',
            sortOrder: 1,
          },
          {
            organizationIds: [selectedOrganization.value],
            search: '',
          }
        )
        .then((response: any) => {
          setSelectWarehouseOptions(
            transformToSelectData(response.data.content)
          )
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    } else {
      setSelectedWarehouses(null)
      setSelectWarehouseOptions([])
    }
  }, [selectedOrganization])

  useEffect(() => {
    if (!values.isProductsReviewedBeforeListing) {
      setReviewProducSwitchMessage(
        t('marketplace_relationships_details_review_product_message')
      )
    } else {
      setReviewProducSwitchMessage('')
    }
  }, [values.isProductsReviewedBeforeListing])

  useEffect(() => {
    if (integration && integrationType) {
      const urlParams = new URLSearchParams(integration.queryString)
      const authCode = urlParams.get('code')
      if (integrationType === 'Tiktok') {
        if (localeMarketplaceId && authCode) {
          new TiktokService(axiosClient)
            .integrate({
              authCode,
              localeMarketplaceId,
            })
            .then(() => {
              setIsShouldGetIntegrationInfo(true)
            })
            .catch((err: any) => {
              handleIntegrationError(err, auth)
            })
        }
      }

      if (integrationType === 'Shopify') {
        handleIntegratePublicAppShopifyApi(authCode)
      }
    }
  }, [integration, integrationType])

  useEffect(() => {
    if (
      shopifyIntegrationAppType === 'custom' &&
      countIntegrateWithCustomApp > 0 &&
      localeMarketplaceId
    ) {
      new ShopifyService(axiosClient)
        .integrateWithCustomApp({
          localeMarketplaceId,
          shopDomain: shopUrl,
          accessToken,
        })
        .then(() => {
          setIsShouldGetIntegrationInfo(true)
        })
        .catch((err: any) => {
          handleIntegrationError(err, auth)
        })
    }
  }, [countIntegrateWithCustomApp])

  useEffect(() => {
    if (
      selectedMarketplace &&
      selectedMarketplace.marketplaceTypeName === 'Amazon' &&
      !marketplaceRelationshipsId
    ) {
      setValues({
        ...values,
        clientId: '',
        clientSecret: '',
        sellerId: '',
        refreshToken: '',
      })
    }
  }, [selectedMarketplace])

  useEffect(() => {
    if (isShouldGetIntegrationInfo) {
      getIntegrationInfo()
    }
  }, [isShouldGetIntegrationInfo])

  useEffect(() => {
    if (localeMarketplaceId) {
      getIntegrationInfo()
    }
  }, [localeMarketplaceId, integrationType])

  useEffect(() => {
    if (countIntegrationInfoChange > 0) {
      if (initialShopUrl !== shopUrl || initialAccessToken !== accessToken) {
        setIsDirtyOutSideForm(true)
      } else {
        setIsDirtyOutSideForm(false)
      }
    } else {
      setIsDirtyOutSideForm(false)
    }
  }, [shopUrl, accessToken])

  useEffect(() => {
    if (isShouldGoBackToList) {
      if (!marketplaceRelationshipsId) {
        if (integrationType !== 'Amazon') {
          returnRelationshipId &&
            handleBackToEditRelationship(returnRelationshipId)
        } else handleBackToList()
      } else handleBackToList()
    }
  }, [isShouldGoBackToList])

  useCallbackPrompt(
    (!isSubmitSuccess && dirty) || (!isSubmitSuccess && isDirtyOutSideForm),
    location.state
  )

  const {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onInputChange,
    onSwitchChange,
  } = useConditionForm(handleChange, formatInputSwitch)

  useCommonAccesibility()

  useSwitchAccesibility(values)

  useEffect(() => {
    document.querySelectorAll('.p-inputswitch').forEach((el) => {
      el.removeAttribute('aria-checked')
    })
  }, [values.isProductsReviewedBeforeListing])

  return (
    <>
      <SeoConfig
        seoProperty={
          !marketplaceRelationshipsId
            ? seoProperty.marketplaceRelationshipAdd
            : seoProperty.marketplaceRelationshipEdit
        }
      ></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {!marketplaceRelationshipsId
              ? t('marketplace_relationships_add_title')
              : t('marketplace_relationships_edit_title')}
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
                {marketplaceRelationshipsId && (
                  <Row className='align-items-center py-1'>
                    <Col xs={4}>
                      <label
                        htmlFor='marketplaceRelationshipId'
                        className={classNames('required', true)}
                      >
                        {t('marketplace_relationships_details_id')}
                      </label>
                    </Col>
                    <Col xs={8} className='p-fluid'>
                      <Select
                        id='marketplaceRelationshipId'
                        name='marketplaceRelationshipId'
                        value={selectedMarketplaceRelationshipId}
                        className={classNames(
                          'react-select inherit-color',
                          true
                        )}
                        classNamePrefix='react-select'
                        isDisabled
                      />
                    </Col>
                  </Row>
                )}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='organizationId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('organizationId'),
                      })}
                    >
                      {t('marketplace_relationships_details_organization')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='organizationId'
                      name='organizationId'
                      options={selectOrganizationOptions}
                      placeholder={t(
                        'marketplace_relationships_organization_placeHolder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'organizationId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('organizationId'),
                      })}
                      ref={selectOrganizationRef}
                      value={selectedOrganization}
                      onBlur={(e) => onSelectBlur(e, 'organizationId')}
                      classNamePrefix='react-select'
                      isDisabled={checkDisableSelectOption()}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='siteId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('siteId'),
                      })}
                    >
                      {t('marketplace_relationships_details_site')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='siteId'
                      name='siteId'
                      options={selectSiteOptions}
                      placeholder={t(
                        'marketplace_relationships_site_placeHolder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'siteId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('siteId'),
                      })}
                      ref={selectSiteRef}
                      value={selectedSite}
                      onBlur={(e) => onSelectBlur(e, 'siteId')}
                      classNamePrefix='react-select'
                      isDisabled={checkDisableSelectOption()}
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='siteLocaleId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('siteLocaleId'),
                      })}
                    >
                      {t('marketplace_relationships_details_locale')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='siteLocaleId'
                      name='siteLocaleId'
                      options={selectLocaleOptions}
                      placeholder={t(
                        'marketplace_relationships_locale_placeHolder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'siteLocaleId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('siteLocaleId'),
                      })}
                      ref={selectLocaleRef}
                      value={selectedLocale}
                      onBlur={(e) => onSelectBlur(e, 'siteLocaleId')}
                      classNamePrefix='react-select'
                      isDisabled={checkDisableSelectOption()}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={{span: 8, offset: 4}} className='py-0'>
                    <small className='p-error text-sm'>
                      {localeIsNotSupportedMessage}
                    </small>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='marketplaceId'
                      className={classNames('required', {
                        'p-error':
                          !values.marketplaceId && touched.marketplaceId,
                      })}
                    >
                      {t('marketplace_relationships_details_marketplace')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      id='marketplaceId'
                      name='marketplaceId'
                      options={selectMarketplaceOptions}
                      placeholder={t(
                        'marketplace_relationships_marketplace_placeHolder'
                      )}
                      isSearchable
                      onChange={(e) => onSelectChange(e, 'marketplaceId')}
                      className={classNames('react-select inherit-color', {
                        'invalid-field':
                          !values.marketplaceId && touched.marketplaceId,
                      })}
                      value={selectedMarketplace}
                      onBlur={(e) => onSelectBlur(e, 'marketplaceId')}
                      classNamePrefix='react-select'
                      isDisabled={checkDisableSelectOption()}
                    />
                  </Col>
                </Row>
                <Row>{getFormErrorMessage('marketplaceId')}</Row>

                {renderControlsByIntegrationType(integrationType)}
                {renderConnectButton()}

                <br />

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='sellingPriceAdjustment'
                      className={classNames('required', {
                        'p-error':
                          !values.sellingPriceAdjustment &&
                          values.sellingPriceAdjustment !== 0 &&
                          touched.sellingPriceAdjustment,
                      })}
                    >
                      {t(
                        'marketplace_relationships_details_selling_price_adjustment'
                      )}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='sellingPriceAdjustment'
                      name='sellingPriceAdjustment'
                      value={values.sellingPriceAdjustment}
                      onBlur={onInputBlur}
                      onChange={onHandleInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid':
                          !values.sellingPriceAdjustment &&
                          values.sellingPriceAdjustment !== 0 &&
                          touched.sellingPriceAdjustment,
                      })}
                      maxLength={128}
                      type='number'
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='isProductsReviewedBeforeListing'
                      className=''
                    >
                      {t(
                        'marketplace_relationships_details_reviewProductsBeforeListing'
                      )}
                    </label>
                  </Col>
                  <Col xs={8}>
                    <InputSwitch
                      name='isProductsReviewedBeforeListing'
                      checked={values.isProductsReviewedBeforeListing === true}
                      onChange={onSwitchChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={{span: 8, offset: 4}} className='py-0'>
                    <small className='p-error text-sm'>
                      {reviewProductSwitchMessage}
                    </small>
                  </Col>
                </Row>

                <Row className='align-items-center'>
                  <Col xs={12} className='mt-3'>
                    <label
                      htmlFor='additionalInformation'
                      className='fs-4 fw-bold'
                    >
                      {t('marketplace_relationships_details_warehouse')}:
                    </label>
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='warehouseId'
                      className={classNames('required', {
                        'p-error': isFormFieldValid('warehouseIds'),
                      })}
                    >
                      {t('marketplace_relationships_details_warehouse')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <Select
                      options={selectWarehouseOptions}
                      placeholder={t(
                        'marketplace_relationships_warehouse_placeHolder'
                      )}
                      isSearchable
                      isMulti
                      onChange={(e) => onSelectChange(e, 'warehouseIds')}
                      ref={selectWarehouseRef}
                      className={classNames('react-select inherit-color', {
                        'invalid-field': isFormFieldValid('warehouseIds'),
                      })}
                      value={selectedWarehouses}
                      onBlur={(e) => onSelectBlur(e, 'warehouseIds')}
                      classNamePrefix='react-select'
                    />
                  </Col>
                </Row>

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label
                      htmlFor='stockMinimumLevel'
                      className={classNames('required', {
                        'p-error':
                          isFormFieldValid('stockMinimumLevel') ||
                          errorMessageStockMinLevel !== '',
                      })}
                    >
                      {t('marketplace_relationships_details_stockMinLevel')}
                    </label>
                  </Col>
                  <Col xs={8} className='p-fluid'>
                    <InputText
                      id='stockMinimumLevel'
                      name='stockMinimumLevel'
                      value={values.stockMinimumLevel}
                      onBlur={onInputBlur}
                      onChange={onHandleInputChange}
                      className={classNames('w-full p-1', {
                        'p-invalid':
                          isFormFieldValid('stockMinimumLevel') ||
                          errorMessageStockMinLevel !== '',
                      })}
                      maxLength={128}
                      type='number'
                    />
                  </Col>
                </Row>

                {errorMessageStockMinLevel !== '' && (
                  <Row>
                    <Col xs={{span: 8, offset: 4}} className='py-0'>
                      <small className='p-error text-sm'>
                        {errorMessageStockMinLevel}
                      </small>
                    </Col>
                  </Row>
                )}

                {renderCredentialSection()}

                <Row className='align-items-center py-1'>
                  <Col xs={4}>
                    <label htmlFor='isActive' className=''>
                      {t('marketplace_relationships_details_status_active')}
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

                <br />

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={handleBackToList}
                      variant='danger'
                    >
                      {t('common_confirm_cancel')}
                    </Button>
                    <Button
                      variant='success'
                      className='me-2'
                      onClick={onHandleSubmit}
                      disabled={
                        isSubmitting ||
                        isSaveButtonDisabled ||
                        checkIsDisabledButtonWithPermission()
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
      {isWindowOpen && (
        <IntegrationWindow
          url={newWindowObj.url}
          name={newWindowObj.name}
          title={newWindowObj.title}
          center='screen'
          features={{
            height: 600,
            width: 600,
          }}
          onOpen={handleOpenNewWindow}
          onUnload={handleUnLoadNewWindow}
        ></IntegrationWindow>
      )}
    </>
  )
}
