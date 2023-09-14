interface IBaseEntities {
  id: string
  erpId: string
  createdAt: string | null
  modifiedAt: string | null
  name: string
  version: number
}

interface IProducProperties extends IBaseEntities{
  type: string
  localeSensitive: boolean
  existedValues: boolean | null
  status: string
}

export type {IProducProperties}
