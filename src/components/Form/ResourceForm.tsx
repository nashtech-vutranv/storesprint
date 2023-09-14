import {Row, Col, Button, Card, Container} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import _ from 'lodash'
import {useFormik} from 'formik'
import {useNavigate} from 'react-router-dom'
import {useRef, useContext, useState, useEffect} from 'react'
import {IResource, IFormResource} from '../../interface/resource'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import ResourceService from '../../services/ResourceService'
import {GlobalContext} from '../../store/GlobalContext'
import {ROUTE_PARAMS, ROUTE_RESOURCE} from '../../constants'
import {useCallbackPrompt, useCommonAccesibility, useSwitchAccesibility, useHandleError} from '../../hooks'
import {ToastContext} from '../../providers/'
import FormData from './Child'

interface IResourceFormProps {
  userId?: string
  resourceId?: string
  resource: IResource | null
  onSavedSuccess: (resourceData: IResource) => void
}

type IResourceErrors = {
  [key in keyof IFormResource]?: string
}

const ResourceForm = (props: IResourceFormProps) => {
  const {userId, resourceId, onSavedSuccess} = props

  const {toast} = useContext(ToastContext)

  const {handleErrorResponse} = useHandleError()

  const siteRef = useRef<any>()

  const {
    state: {axiosClient, resource},
  } = useContext(GlobalContext)

  const navigate = useNavigate()

  const {t} = useTranslation()

  const [organizationsDropDownList, setOrganizationsDropDownList] = useState<
    any[]
  >([])
  const [sitesBySelectedOrganization, setSitesBySelectedOrganization] =
    useState<any[]>([])

  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
  const [selectedSite, setSelectedSite] = useState<any>(null)

  const [isNotSuccessUpdatedResource, setIsNotSucessUpdatedResource] =
    useState<boolean>(true)

  const showResourceSuccessEdited = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_modified'),
      life: 5000,
    })
  }

  const {
    isSubmitting,
    setSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    errors,
    touched,
    dirty,
    values,
  } = useFormik<IFormResource>({
    enableReinitialize: true,
    initialValues: {
      userId,
      organizationId:
        resourceId && resource?.organizationResponse?.id || null,
      siteId:
        resourceId && resource?.siteResponse?.id || null
    },
    onSubmit: (data) => {
      setSubmitting(true)

      if (userId && resourceId && resource) {
        new ResourceService(axiosClient)
          .editResource(resourceId, {
            userId,
            organizationId: data.organizationId,
            siteId: data.siteId,
            version: resource.version,
          })
          .then((response: any) => {
            setSubmitting(false)
            onSavedSuccess(response.data)
            showResourceSuccessEdited()
            setIsNotSucessUpdatedResource(false)
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
      } else {
        new ResourceService(axiosClient)
          .addResource({
            userId,
            organizationId: data.organizationId,
            siteId: data.siteId,
          })
          .then((response: any) => {
            setSubmitting(false)
            onSavedSuccess(response.data)
            showResourceSuccessAdded()
            setIsNotSucessUpdatedResource(false)
          })
          .catch((err: any) => {
            handleErrorResponse(err)
          })
      }
    },
    validate: (data) => {
      let validErrors: IResourceErrors = {}

      if (!data.organizationId) {
        validErrors.organizationId = t('form_validate_required')
      }

      if (!selectedSite) {
        validErrors.siteId = t('form_validate_required')
      }

      return validErrors
    },
  })

  useCallbackPrompt(dirty && isNotSuccessUpdatedResource)

  const isFormFieldValid = (name: keyof IFormResource) => {
    return !!touched[name] && errors[name]
  }

  const showResourceSuccessAdded = () => {
    toast?.current.show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_success_added_assigned_resource'),
      life: 5000,
    })
  }

  const backToResources = () => {
    userId &&
      navigate(ROUTE_RESOURCE.ROOT.replace(ROUTE_PARAMS.USER_ID, userId))
  }

  const onOrganizationsChange = (newValue: any) => {
    if (newValue && !_.isEmpty(organizationsDropDownList)) {
      const findOrgElement = organizationsDropDownList.find(
        (org: any) => org.name === newValue.label
      )
      if (findOrgElement) {
        setFieldValue('organizationId', newValue.value)
        setSelectedOrganization(findOrgElement)
      } else {
        setFieldValue('organizationId', null)
        setSelectedOrganization(null)
      }
    }
  }

  const onSitesChange = (newValue: any) => {
    if (newValue) {
      if (!_.isEmpty(sitesBySelectedOrganization)) {
        const findSiteElement = sitesBySelectedOrganization.find(
          (site: any) => site.name === newValue.label
        )
        if (findSiteElement) {
          setFieldValue('siteId', findSiteElement.id)
          setSelectedSite(findSiteElement)
        } else {
          setFieldValue('siteId', 'All site')
          setSelectedSite(null)
        }
      } else {
        setFieldValue('siteId', 'All site')
      }
    }
  }

  const handleOrganizationDropdownBlur = () => {
    setFieldTouched('organizationId')
  }

  const handleSitesDropdownBlur = () => {
    setFieldTouched('siteId')
  }

  const onUpdateSiteWhenExistedResource = (response: any) => {
    if (!resourceId || !resource) {
      if (!_.isEmpty(response.data)) {
        setSitesBySelectedOrganization(
          response.data.map((item: any) =>
            item !== null
              ? item
              : {name: t('resource_all_site_label'), id: null}
          )
        )
        setSelectedSite(null)
      } else {
        setSitesBySelectedOrganization([])
      }
    }
  }

  const onUpdateSiteWithNonExistedResource = (response: any, resources: IResource) => {
    if (resources.siteResponse) {
      setSitesBySelectedOrganization([
        resources.siteResponse,
        ...response.data,
      ])
      setSelectedSite(resources.siteResponse)
    } else {
      setSitesBySelectedOrganization([])
      setSelectedSite(null)
    }
  }

  useEffect(() => {
    if (resourceId && resource) {
      setSelectedOrganization(resource.organizationResponse)
      setOrganizationsDropDownList([resource.organizationResponse])
    }
  }, [resourceId])

  useEffect(() => {
    if (!resourceId && userId) {
      new ResourceService(axiosClient)
        .getOrganizationsByExcludedAllSiteOption(userId)
        .then((response: any) => {
          const excludedAllSitesOrganizationsData = response.data
          setOrganizationsDropDownList(excludedAllSitesOrganizationsData)
          setSelectedOrganization(null)
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [userId])

  useEffect(() => {
    if (userId && selectedOrganization) {
      new ResourceService(axiosClient)
        .getSitesBySelectedExcludedAllSiteOrganization(
          userId,
          selectedOrganization.id
        )
        .then((response: any) => {
          if (!resourceId || !resource) {
            onUpdateSiteWhenExistedResource(response)
          } else {
            onUpdateSiteWithNonExistedResource(response, resource)
          }
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [userId, selectedOrganization])

  useEffect(() => {
    if (!isNotSuccessUpdatedResource) {
      backToResources()
    }
  }, [isNotSuccessUpdatedResource])

  useCommonAccesibility()

  useSwitchAccesibility(values)

  return (
    <>
      <SeoConfig
        seoProperty={
          resourceId ? seoProperty.resourceEdit : seoProperty.resourceAdd
        }
      ></SeoConfig>
      <Card className='card-form'>
        <Card.Header>
          <h4 className='card-form__title'>
            {resourceId ? t('resource_edit_title') : t('resource_add_title')}
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
                <FormData 
                  resourceId={resourceId}
                  isFormFieldValid={isFormFieldValid}
                  resource={resource}
                  selectedOrganization={selectedOrganization}
                  selectedSite={selectedSite}
                  organizationsDropDownList={organizationsDropDownList}
                  sitesBySelectedOrganization={sitesBySelectedOrganization}
                  onOrganizationsChange={onOrganizationsChange}
                  touched={touched}
                  values={values}
                  handleOrganizationDropdownBlur={handleOrganizationDropdownBlur}
                  handleSitesDropdownBlur={handleSitesDropdownBlur}
                  onSitesChange={onSitesChange}
                  siteRef={siteRef}
                />

                <Row>
                  <Col xs={{span: 8, offset: 4}}>
                    <Button
                      className='me-2'
                      onClick={backToResources}
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
                        !selectedSite ||
                        !_.isEmpty(
                          sitesBySelectedOrganization.filter(
                            (item) => item.id === 'All site'
                          )
                        )
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

export default ResourceForm
