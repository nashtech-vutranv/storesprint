import faker from '@faker-js/faker'
import {
  ICreateUpdateDefaultPropertyValue,
  IDefaultPropertyValue,
} from '../../interface/defaultPropertyValue'

export const mockDefaultPropertyValue = (): IDefaultPropertyValue => {
  return {
    id: faker.datatype.string(),
    localeId: faker.datatype.string(),
    propertyId: faker.datatype.string(),
    organizationId: faker.datatype.string(),
    localeName: faker.datatype.string(),
    propertyName: faker.datatype.string(),
    organizationName: faker.datatype.string(),
    defaultValue: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    status: faker.datatype.string(),
    version: faker.datatype.number(),
  }
}

export const mockResponseAddUpdateDefaultPropertyValue =
  (): ICreateUpdateDefaultPropertyValue => {
    return {
      id: faker.datatype.string(),
      localeId: faker.datatype.string(),
      propertyId: faker.datatype.string(),
      organizationId: faker.datatype.string(),
      defaultValue: faker.datatype.string(),
      status: faker.datatype.string(),
      version: faker.datatype.number(),
    }
  }

export const mockDefaultPropertyValues = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() =>
        mockDefaultPropertyValue()
      ),
      totalElements: 10,
    },
  }
}
