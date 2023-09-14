import {IBaseEntities, IBaseEntitiesOmitNameAndErpId} from './'

interface IProductPropertyMappings {
  attributeResponse: IAttributeType,
  mappingResponse: IMappingResponse,
  propertyResponse: IPropertyResponse
}

interface IAttributeType extends IBaseEntitiesOmitNameAndErpId {
    attributeType: string
    description: string
    isEnum: boolean
    isMandatory: boolean
    locale?: string
    mappingTypeId: string
    marketplaceCode?: string
    marketplaceTypeId: string
    value: string
    status: string
}

interface IMappingResponse extends IBaseEntitiesOmitNameAndErpId {
    mappingTypeId: string
    marketplaceTypeId: string
    marketplaceValue: string
    mmsValue: string
}

interface IPropertyResponse extends IBaseEntities {
  localeSensitive: boolean
  type: string
}

interface IUpdateProductPropertyMapping {
  version: number
  marketplaceTypeId: string
  mmsValue: string
  marketplaceValue: string
  marketplaceCode?: string | null
}


export type {IProductPropertyMappings, IUpdateProductPropertyMapping}
