export interface IDeliveryType {
    id: string
    deliveryTypeId: string
    deliveryTypeName: string
}

export interface IDeliveryTypeMapping {
    id: string
    mmsValue: string
    marketplaceValue: string
}

export interface ICreateUpdateDeliveryTypeMapping {
    version: number
    marketplaceTypeId: string
    mmsValue: string
    marketplaceValue: string
    marketplaceCode?: string
}

export interface IMarketplaceDeliveryService {
    id: string
    mappingTypeId: string
    marketplaceTypeId: string
    marketplaceValue: string
    marketplaceCode?: string
}