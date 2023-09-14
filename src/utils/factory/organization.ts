import faker from '@faker-js/faker'
import {ISite, ISiteLocale} from '../../interface/organization'

export const mockOrganization = (props?: any) => ({
  id: faker.random.word(),
  erpId: faker.random.word(),
  name: faker.random.word(),
  additionalInformation: faker.random.word(),
  contactName: faker.random.word(),
  contactPhoneNumber: faker.random.word(),
  contactEmailAddress: faker.random.word(),
  addressLine1: faker.random.word(),
  addressLine2: faker.random.word(),
  addressLine3: faker.random.word(),
  city: faker.random.word(),
  postCode: faker.random.word(),
  registrationNumber: faker.random.word(),
  vatRegistrationNumber: faker.random.word(),
  version: faker.random.word(),
  createdAt: faker.random.word(),
  modifiedAt: faker.random.word(),
  status: 'ACTIVE',
  ...props,
})

export const mockOrganizations = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockOrganization()),
      totalElements: 10
    },
  }
}

export const mockSite = (): ISite => {
  return {
    id: faker.datatype.string(),
    erpId: faker.datatype.string(),
    name: faker.datatype.string(),
    status: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    organizationId: faker.datatype.string(),
    url: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}

export const mockSites = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockSite()),
      totalElements: 10
    },
  }
}

export const mockSiteLocale = (): ISiteLocale => {
  return {
    id: faker.datatype.string(),
    erpId: faker.datatype.string(),
    name: faker.datatype.string(),
    status: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    localeId: faker.datatype.string(),
    siteId: faker.datatype.string(),
    platformId: faker.datatype.string(),
    url: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}

export const mockSiteLocales = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockSiteLocale()),
      totalElements: 10,
    },
  }
}
