import {IBaseEntitiesOmitNameAndErpId} from '.'

interface ICourierMapping extends IBaseEntitiesOmitNameAndErpId {
    marketplaceTypeId: string
    mappingTypeId: string
    mmsValue: string
    marketplaceValue: string
    marketplaceType: {
        id: string
        name: string
    }
    mappingType: {
        id: string
        name: string
    }
    mappingTarget: {
        id: string
        marketplaceTypeId: string
        mappingTypeId: string
        marketplaceCode: string
        marketplaceValue: string
    }
}

export type {
    ICourierMapping
}