import {useParams} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useHandleError} from '../../../hooks'
import {IResource} from '../../../interface/resource'
import ResourceService from '../../../services/ResourceService'
import {GlobalContext} from '../../../store/GlobalContext'
import {ResourceActionType} from '../../../store/actions'
import ResourceForm from '../../../components/Form/ResourceForm'
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb'
import {ROUTE_PARAMS, ROUTE_RESOURCE, ROUTE_USER} from '../../../constants'

const UpdateAssignedResource = () => {
  const {userId, resourceId} = useParams<{userId: string; resourceId: string}>()
  const [orgNameResponse, setOrgNameResponse] = useState<any>(null)

  const {
    state: {user, resource, axiosClient},
    dispatch: {resource: resourceDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const {t} = useTranslation()

  const onSavedSuccess = (resourceData: IResource) => {
    resourceDispatch({
      type: ResourceActionType.GET_RESOURCE_INFORMATION,
      payload: resourceData,
    })
  }

  const renderAssignResource = () => {
    if (userId) {
      return (
        <>
          <BreadCrumb
            origin='users'
            breadCrumbItems={
              resourceId
                ? [
                    {
                      label: user.fullName ? user.fullName : userId,
                      active: false,
                      path: ROUTE_USER.EDIT.replace(ROUTE_PARAMS.USER_ID, userId),
                    },
                    {
                      label: t('resources_page_title'),
                      active: false,
                      path: ROUTE_RESOURCE.ROOT.replace(
                        ROUTE_PARAMS.USER_ID,
                        userId
                      ),
                    },
                    {label: orgNameResponse ? orgNameResponse : '', active: true},
                  ]
                : [
                    {
                      label: user.fullName ? user.fullName : userId,
                      active: false,
                      path: ROUTE_USER.EDIT.replace(ROUTE_PARAMS.USER_ID, userId),
                    },
                    {label: t('resources_page_title'), active: true},
                  ]
            }
          />
          <ResourceForm
            userId={userId}
            resourceId={resourceId}
            resource={resource}
            onSavedSuccess={onSavedSuccess}
          />
        </>
      )
    } return (
    <></>
  )
}

  useEffect(() => {
    if (resourceId) {
      new ResourceService(axiosClient)
        .getResourceById(resourceId)
        .then((response: any) => {
          setOrgNameResponse(response.data.organizationResponse.name)
          resourceDispatch({
            type: ResourceActionType.GET_RESOURCE_INFORMATION,
            payload: response.data,
          })
        })
        .catch((err: any) => {
          handleErrorResponse(err)
        })
    }
  }, [resourceId])
  
  return renderAssignResource()
}

export default UpdateAssignedResource
