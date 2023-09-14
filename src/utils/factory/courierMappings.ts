import faker from '@faker-js/faker'

export const mockCourierMapping = () => ({
  courierProviderId: faker.datatype.string(),
  courierProviderName: faker.datatype.string(),
  id: faker.datatype.string(),
})

export const mockCourierMappings = () => {
  return Array.apply(null, Array(10)).map(() => mockCourierMapping())
}

export const mockMarketplaceCourier = () => ({
  id: faker.datatype.string(),
  marketplaceTypeId: faker.datatype.string(),
  mappingTypeId: faker.datatype.string(),
  marketplaceValue: faker.datatype.string(),
  marketplaceCode: faker.datatype.string(),
})

export const mockMarketplaceCouriers = () => {
  return Array.apply(null, Array(10)).map(() => mockMarketplaceCourier())
}
