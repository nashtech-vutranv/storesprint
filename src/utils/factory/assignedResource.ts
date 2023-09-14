import faker from '@faker-js/faker'

export const mockAssignedResource = () => {
  return {
    data: {
      createdAt: faker.datatype.string(),
      id: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
      organizationResponse: {
        additionalInformation: faker.datatype.string(),
        addressLine1: faker.datatype.string(),
        addressLine2: null,
        addressLine3: null,
        city: faker.datatype.string(),
        contactEmailAddress: faker.datatype.string(),
        contactName: faker.datatype.string(),
        contactPhoneNumber: faker.datatype.string(),
        createdAt: faker.datatype.string(),
        erpId: faker.datatype.string(),
        id: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        name: faker.datatype.string(),
        postCode: faker.datatype.string(),
        registrationNumber: faker.datatype.string(),
        status: faker.datatype.string(),
        vatRegistrationNumber: faker.datatype.string(),
        version: faker.datatype.number(),
      },
      siteResponse: {
        createdAt: faker.datatype.string(),
        erpId: faker.datatype.string(),
        id: faker.datatype.string(),
        modifiedAt: faker.datatype.string(),
        name: faker.datatype.string(),
        organizationId: faker.datatype.string(),
        status: faker.datatype.string(),
        url: faker.datatype.string(),
        version: faker.datatype.number(),
      },
      userResponse: null,
      version: faker.datatype.number(),
    },
  }
}
