import {IBaseEntities} from '.'

interface IWarehouse extends IBaseEntities {
  status?: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  country: string
}

export type {IWarehouse}
