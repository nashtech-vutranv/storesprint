import {IBaseEntities} from '.'

interface IOrganization extends IBaseEntities {
  additionalInformation: string
  contactName: string
  contactPhoneNumber?: string
  contactEmailAddress: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  postCode: string
  registrationNumber: string
  vatRegistrationNumber: string
  status?: string
  platformSetting?: IPlatformSetting
}

interface IPlatformSetting {
  version: number
  apiEndpoint?: string
  authEndpoint?: string
  clientId?: string
  clientSecret?: string
}

interface ISite extends IBaseEntities {
  organizationId: string | undefined
  url: string
  status?: string
}

interface ISiteLocale extends IBaseEntities {
  siteId: string
  localeId: string
  platformId?: string
  url: string
  status: string
}

export type {IOrganization, ISite, ISiteLocale, IPlatformSetting}
