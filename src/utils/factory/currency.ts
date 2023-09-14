import faker from '@faker-js/faker'
import {ICurrency} from '../../interface/currency'

export const mockCurrency = (): ICurrency => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
  }
}

export const mockCurrencies = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockCurrency()),
      totalElements: 10,
    },
  }
}
