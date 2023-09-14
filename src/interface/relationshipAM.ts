import {IAggregator} from './aggregator'

interface IBaseEntity {
  id: string
  createdAt: string
  modifiedAt: string
  version: number
  status: 'ACTIVE' | 'INACTIVE'
}

interface IRelationshipAM {
  id: string
  name: string
  aggregator: IAggregator
}

interface IAddRelationshipAM
  extends Omit<IBaseEntity, 'id' | 'createdAt' | 'modifiedAt'> {
  marketplaceId: string
  aggregatorId: string
}

export type {IRelationshipAM, IAddRelationshipAM}
