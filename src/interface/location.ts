import {Location} from 'react-router-dom'
import {ISelectOption} from './selectOption'
import {ISelectedItem, ICurrentStatus, IEventKey} from './pageInfo'

interface IAdditionalState<S = ICurrentStatus, E = IEventKey> {
  eventKey: E
  currentStatus: S
}

interface IProductLocation<T = ISelectedItem, S = ICurrentStatus, E = IEventKey>
  extends Omit<Location, 'state'> {
  state: {
    selectedOrganizations: T[]
    selectedSites: T[]
    selectedLocales: T[]
    eventKey: E
    currentStatus: S
  }
}

interface IDefaultPropertyLocation<
  T = ISelectedItem,
  S = ICurrentStatus,
  E = IEventKey
> extends Omit<Location, 'state'> {
  state: {
    selectedOrganizations: T[]
    selectedProperties: T[]
    selectedLocales: T[]
    eventKey: E
    currentStatus: S
  }
}

interface IRelationshipLocation extends IProductLocation {}

interface IMappingState<T = ISelectOption | null> extends IAdditionalState {
  selectedMappingType: T
  selectedMappingMarketplace: T
}

interface IProductCategoryMappingsState<T = ISelectOption | null>
  extends IAdditionalState {
  selectedMmsProductCategory: T
  selectedMarketplaceType: T
  unMappedMmsProductCategory?: T
}

interface IProductPropertyMappingsState<T = ISelectOption | null>
  extends IAdditionalState {
  selectedMarketplaceType: T
  selectedMarketplaceProductCategory: T
}

interface IAddProductPropertyMappingState
  extends IProductCategoryMappingsState {
  marketplaceProductProperty: string
  marketplaceTypeId: string
  marketplaceCode: string | null
}

interface ICustomLocation<
  ST =
    | IMappingState
    | IProductCategoryMappingsState
    | IProductPropertyMappingsState
    | IAddProductPropertyMappingState
> extends Omit<Location, 'state'> {
  state: ST
}

export type {
  IProductLocation,
  IRelationshipLocation,
  IDefaultPropertyLocation,
  IMappingState,
  IProductCategoryMappingsState,
  IProductPropertyMappingsState,
  IAddProductPropertyMappingState,
  ICustomLocation,
  IAdditionalState,
}
