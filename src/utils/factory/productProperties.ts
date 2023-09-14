import faker from '@faker-js/faker'
import {IProducProperties, IFilterResponseData} from '../../interface'
import {mockPaginationResponse} from './'

export const mockProductProperty = (): IProducProperties => {
  return {
    id: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    version: faker.datatype.number(),
    erpId: faker.datatype.string(),
    name: faker.datatype.string(),
    type: faker.datatype.string(),
    localeSensitive: faker.datatype.boolean(),
    existedValues: null,
    status: faker.datatype.string(),
  }
}

export const mockProductProperties = (): IFilterResponseData<
  IProducProperties[]
> => {
  return {
    ...mockPaginationResponse(),
    content: Array.apply(null, Array(10)).map(() => mockProductProperty()),
    totalElements: 10,
  }
}
