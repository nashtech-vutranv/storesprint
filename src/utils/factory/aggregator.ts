import faker from '@faker-js/faker'

export const mockAggregator = () => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    status: faker.datatype.string(),
  }
}

export const mockAggregators = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockAggregator()),
      totalElements: 10,
    },
  }
}
