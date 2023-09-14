import {useParams} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ISiteLocale} from '../../../interface/organization'
import SiteLocaleService from '../../../services/SiteLocaleService'
import {GlobalContext} from '../../../store/GlobalContext'
import SiteLocaleForm from '../../../components/Form/SiteLocaleForm'
import BreadCrumb, {
  BreadcrumbItems,
} from '../../../components/BreadCrumb/BreadCrumb'
import {
  ROUTE_ORG,
  ROUTE_PARAMS,
  ROUTE_SITE,
  ROUTE_SITE_LOCALE,
} from '../../../constants'
import {useCommonAccesibility, useHandleError} from '../../../hooks'

const UpdateSiteLocale = () => {
  const {siteLocaleId, siteId, orgId} =
    useParams<{siteLocaleId: string; siteId: string; orgId: string}>()

  const {t} = useTranslation()
  const [defaultSiteLocale, setDefaultSiteLocale] = useState({
    id: '',
    erpId: '',
    siteId: '',
    localeId: '',
    name: '',
    status: 'ACTIVE',
    version: 0,
    createdAt: '',
    modifiedAt: '',
    url: '',
  } as ISiteLocale)

  const {
    state: {axiosClient, organization, site},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const breadCrumbItems =
    orgId && siteId
      ? [
          {
            label: organization ? organization.name : orgId,
            active: false,
            path: ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId),
          },
          {
            label: t('sites_pate_title'),
            active: false,
            path: ROUTE_SITE.ROOT.replace(ROUTE_PARAMS.ORG_ID, orgId),
          },
          {
            label: site.name,
            active: false,
            path: ROUTE_SITE.EDIT.replace(ROUTE_PARAMS.ORG_ID, orgId).replace(
              ROUTE_PARAMS.SITE_ID,
              siteId
            ),
          },
        ]
      : []

  const onSavedSuccess = (siteLocale: ISiteLocale) => {
    setDefaultSiteLocale(siteLocale)
  }

  useEffect(() => {
    if (siteLocaleId) {
      getSiteLocale()
    }
  }, [])

  useCommonAccesibility()

  const getSiteLocale = () => {
    new SiteLocaleService(axiosClient)
      .getLocaleBySiteId(siteLocaleId)
      .then((response: any) => {
        setDefaultSiteLocale(response.data)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const getBreadcrumbItems = (): BreadcrumbItems[] => {
    return siteLocaleId
      ? [
          ...breadCrumbItems,
          {
            label: t('siteLocales_page_title'),
            active: false,
            path: ROUTE_SITE_LOCALE.ROOT.replace(
              ROUTE_PARAMS.ORG_ID,
              `${orgId}`
            ).replace(ROUTE_PARAMS.SITE_ID, `${siteId}`),
          },
          {
            label: defaultSiteLocale.localeId,
            active: true,
          },
        ]
      : [
          ...breadCrumbItems,
          {
            label: t('siteLocales_page_title'),
            active: true,
          },
        ]
  }

  return orgId && siteId ? (
    <>
      <BreadCrumb breadCrumbItems={getBreadcrumbItems()} />
      <SiteLocaleForm
        orgId={orgId}
        siteId={siteId}
        siteLocaleId={siteLocaleId}
        defaultSiteLocale={defaultSiteLocale}
        onSavedSuccess={onSavedSuccess}
        getSiteLocale={getSiteLocale}
      />
    </>
  ) : (
    <></>
  )
}

export default UpdateSiteLocale
