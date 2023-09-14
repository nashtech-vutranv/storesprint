interface IValueMappingsRequest {
  marketplaceTypeId: string | null
  propertyName: string
  search: string
}

interface IMappingTarget {
  id: string
  marketplaceTypeId: string
  mappingTypeId: string
  marketplaceValue: string
  marketplaceCode: string
}

interface IMapping {
  id: string
  createdAt: string | null
  modifiedAt: string | null
  version: number
  marketplaceTypeId: string
  mappingTypeId: string
  mmsValue: string
  marketplaceValue: string
}

interface IValueMappingResponse {
  mappingTarget: IMappingTarget
  mappings: IMapping[] | null
}

interface IValueMapping {
  mappingTarget: IMappingTarget
  mappings: IMapping[]
}

type IValueMappingsResponse = IValueMappingResponse[]

type IValueMappings = IValueMapping[]

interface IUpdateValueMappingRequest {
  marketplaceTypeId: string
  mappingTypeId: string
  mmsValues: string[]
  marketplaceValue: string
  marketplaceCode: string
}

export type {
  IValueMappingsRequest,
  IValueMappingResponse,
  IValueMappingsResponse,
  IUpdateValueMappingRequest,
  IValueMappings,
  IValueMapping
}