import faker from '@faker-js/faker'
import {IMarketplace} from '../../interface/marketplace'
import {IMarketplacesDialog} from '../../interface/assignMarketplace'

export const mockMarketplace = (): IMarketplace => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    status: faker.datatype.string(),
    currencyId: faker.datatype.string(),
    currency: {
      id: faker.random.word(),
      name: faker.random.word(),
      version: faker.datatype.number(),
      createdAt: faker.datatype.string(),
      modifiedAt: faker.datatype.string(),
    },
    createdAt: faker.datatype.string(),
    modifiedAt: faker.datatype.string(),
  }
}

export const mockMarketplaces = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockMarketplace()),
      totalElements: 10,
    },
  }
}

export const mockMarketplaceType = () => ({
  id: faker.datatype.string(),
  name: faker.datatype.string(),
})

export const mockMarketplaceTypes = () => {
  return Array.apply(null, Array(10)).map(() => mockMarketplaceType())
}

export const mockAssignMarketplace = () => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    erpId: faker.datatype.string(),
  }
}

export const mockAssignMarketplaces = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() => mockAssignMarketplace()),
      totalElements: 10,
    },
  }
}

export const mockCalculateAssignMarketplace = () => {
  return {
    id: faker.random.word(),
    name: faker.random.word(),
    version: faker.datatype.number(),
    assignedStatus: 'ASSIGNED',
  }
}

export const mockCalculateAssignMarketplaces = () => {
  return {
    data: {
      content: Array.apply(null, Array(10)).map(() =>
        mockCalculateAssignMarketplace()
      ),
      totalElements: 10,
    },
  }
}

export const mockCalculatedMarketplacesDialog: IMarketplacesDialog[] = [
  {
    id: 'mrk_id_1',
    version: 0,
    name: 'mrk_1',
    assignedStatus: 'ASSIGNED',
  },
  {
    id: 'mrk_id_2',
    version: 0,
    name: 'mrk_2',
    assignedStatus: 'UNASSIGNED',
  },
  {
    id: 'mrk_id_3',
    version: 0,
    name: 'mrk_3',
    assignedStatus: 'BOTH',
  },
]

export const mockNotCalculatedMarketplacesDialog: IMarketplacesDialog[] = [
  {
    id: 'mrk_id_1',
    version: 0,
    name: 'mrk_1',
    assignedStatus: null,
  },
  {
    id: 'mrk_id_2',
    version: 0,
    name: 'mrk_2',
    assignedStatus: null,
  },
  {
    id: 'mrk_id_3',
    version: 0,
    name: 'mrk_3',
    assignedStatus: null,
  },
]
