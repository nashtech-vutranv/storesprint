interface IBaseEntities {
  id: string
  erpId: string
  createdAt: string
  modifiedAt: string
  name: string
  version: number
}

interface IBaseEntitiesOmitErpId extends Omit<IBaseEntities, 'erpId'> {}

interface IBaseEntitiesOmitName extends Omit<IBaseEntities, 'name'> {}

interface IBaseEntitiesOmitNameAndErpId
  extends Omit<IBaseEntities, 'erpId' | 'name'> {}

export type {
  IBaseEntities,
  IBaseEntitiesOmitErpId,
  IBaseEntitiesOmitName,
  IBaseEntitiesOmitNameAndErpId,
}
