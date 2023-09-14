import faker from '@faker-js/faker'

export const mockRelationshipAM = () => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
    marketplaceId: faker.datatype.string(),
    aggregatorId: faker.datatype.string(),
    status: 'ACTIVE',
  }
}

