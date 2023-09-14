import faker from '@faker-js/faker'
import {IWarehouse} from '../../interface/warehouse'

export const mockWarehouse = (): IWarehouse => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    status: faker.datatype.string(),
    erpId: faker.datatype.string(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    addressLine1: faker.datatype.string(),
    addressLine2: faker.datatype.string(),
    addressLine3: faker.datatype.string(),
    country: faker.datatype.string(),
  }
}

export const mockWarehouses = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockWarehouse()),
      totalElements: 10,
    },
  }
}
