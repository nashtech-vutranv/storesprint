import {IBaseEntitiesOmitName, IOrganization, ISite} from '.'

export interface IResource extends IBaseEntitiesOmitName {
  organizationResponse: IOrganization
  siteResponse: ISite
}

export interface IFormResource {
  userId?: string
  organizationId: string | null
  siteId: string | null
}
