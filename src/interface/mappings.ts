import {IBaseEntitiesOmitErpId} from './'

interface ISelectValue {
  label: string
  value: string
}

interface IMappingType extends IBaseEntitiesOmitErpId  {}

interface IMappingMarketplace extends IBaseEntitiesOmitErpId {}

interface IMappingTarget extends Omit<IBaseEntitiesOmitErpId, 'name'> {
  marketplaceValue: string[] | []
}

interface IAddMappingForm {
  marketplaceTypeId?: ISelectValue
  mappingTypeId?: ISelectValue
  mappingValues: {
    id: string,
    mmsValue: {id: string; label: string}
    marketplaceValue: {id: string; label: string, marketplaceCode: string}
    version: number
  }[]
}

interface IBaseAddMappingResponse {
  id: string
  marketplaceTypeId: string
  mappingTypeId: string
  marketplaceValue: string
}

interface IAddMappingResponse extends IBaseAddMappingResponse {
  mmsValue: string
}

type IAddMappingTargetsResponse = Array<IBaseAddMappingResponse> 
  
export type {
  IMappingType,
  IMappingMarketplace,
  IMappingTarget,
  IAddMappingForm,
  IAddMappingResponse,
  IAddMappingTargetsResponse
}
