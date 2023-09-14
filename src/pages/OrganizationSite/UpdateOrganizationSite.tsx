import {useParams} from 'react-router-dom'
import {useEffect, useContext, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ISite} from '../../interface/organization'
import SitesService from '../../services/SitesService'
import {GlobalContext} from '../../store/GlobalContext'
import SiteForm from '../../components/Form/SiteForm'
import BreadCrumb, {
  BreadcrumbItems,
} from '../../components/BreadCrumb/BreadCrumb'
import {ROUTE_ORG, ROUTE_PARAMS, ROUTE_SITE} from '../../constants'
import {useCommonAccesibility, useHandleError} from '../../hooks'

const UpdateOrganizationSite = () => {
  const {siteId, orgId} = useParams<{siteId: string; orgId: string}>()
  const [defaultSite, setDefaultSite] = useState({
    id: '',
    erpId: '',
    name: '',
    organizationId: '',
    url: '',
    status: 'ACTIVE',
    version: 0,
    createdAt: '',
    modifiedAt: '',
  } as ISite)
  const {
    state: {axiosClient, organization},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {t} = useTranslation()

  const onSavedSuccess = (site: ISite) => {
    setDefaultSite(site)
  }

  const getSite = () => {
    new SitesService(axiosClient)
      .getSiteById(siteId)
      .then((response: any) => {
        setDefaultSite(response.data)
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  useEffect(() => {
    if (siteId) {
      getSite()
    }
  }, [siteId])

  useCommonAccesibility()

  const getBreadcrumbItems = (): BreadcrumbItems[] => {
    return siteId
      ? [
          {
            label: organization ? organization.name : `${orgId}`,
            active: false,
            path: ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, `${orgId}`),
          },
          {
            label: t('sites_pate_title'),
            active: false,
            path: ROUTE_SITE.ROOT.replace(ROUTE_PARAMS.ORG_ID, `${orgId}`),
          },
          {label: defaultSite.name, active: true},
        ]
      : [
          {
            label: organization ? organization.name : `${orgId}`,
            active: false,
            path: ROUTE_ORG.EDIT.replace(ROUTE_PARAMS.ORG_ID, `${orgId}`),
          },
          {label: t('sites_pate_title'), active: true},
        ]
  }

  return orgId ? (
    <>
      <BreadCrumb breadCrumbItems={getBreadcrumbItems()} />
      <SiteForm
        siteId={siteId}
        orgId={orgId}
        defaultSite={defaultSite}
        onSavedSuccess={onSavedSuccess}
        getSite={getSite}
      />
    </>
  ) : (
    <></>
  )
}

export default UpdateOrganizationSite
