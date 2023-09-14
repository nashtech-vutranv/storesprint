import {IOrganization, ISite} from '../interface/organization'
import {IUser} from '../interface/user'
import {IResource} from '../interface/resource'
import {
  LayoutTypes,
  LayoutColor,
  LayoutWidth,
  SideBarTheme,
  SideBarWidth,
} from '../constants'
import {IAggregator} from '../interface/aggregator'
import {IMarketplace} from '../interface/marketplace'
import {IMarketplaceRelationship} from '../interface/marketplaceRelationship'

export enum LayoutActionTypes {
  CHANGE_LAYOUT = '@@layout/CHANGE_LAYOUT',
  CHANGE_LAYOUT_COLOR = '@@layout/CHANGE_LAYOUT_COLOR',
  CHANGE_LAYOUT_WIDTH = '@@layout/CHANGE_LAYOUT_WIDTH',
  CHANGE_SIDEBAR_THEME = '@@layout/CHANGE_SIDEBAR_THEME',
  CHANGE_SIDEBAR_TYPE = '@@layout/CHANGE_SIDEBAR_TYPE',
  SHOW_RIGHT_SIDEBAR = '@@layout/SHOW_RIGHT_SIDEBAR',
  HIDE_RIGHT_SIDEBAR = '@@layout/HIDE_RIGHT_SIDEBAR',
}

export type LayoutStateType = {
  layoutColor: LayoutColor.LAYOUT_COLOR_LIGHT | LayoutColor.LAYOUT_COLOR_DARK
  layoutType:
    | LayoutTypes.LAYOUT_VERTICAL
    | LayoutTypes.LAYOUT_HORIZONTAL
    | LayoutTypes.LAYOUT_DETACHED
    | LayoutTypes.LAYOUT_FULL
  layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID | LayoutWidth.LAYOUT_WIDTH_BOXED
  leftSideBarTheme:
    | SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT
    | SideBarTheme.LEFT_SIDEBAR_THEME_DARK
    | SideBarTheme.LEFT_SIDEBAR_THEME_DEFAULT
  leftSideBarType:
    | SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED
    | SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED
    | SideBarWidth.LEFT_SIDEBAR_TYPE_SCROLLABLE
  showRightSidebar: boolean
}

export type LayoutActionType<TPayload> = {
  type:
    | LayoutActionTypes.CHANGE_LAYOUT
    | LayoutActionTypes.CHANGE_LAYOUT_COLOR
    | LayoutActionTypes.CHANGE_LAYOUT_WIDTH
    | LayoutActionTypes.CHANGE_SIDEBAR_THEME
    | LayoutActionTypes.CHANGE_SIDEBAR_TYPE
    | LayoutActionTypes.SHOW_RIGHT_SIDEBAR
    | LayoutActionTypes.HIDE_RIGHT_SIDEBAR
  payload?: TPayload
}

export type ModalStateType = {
  openModal: boolean
}

export enum ModalActionTypes {
  OPEN_MODAL = '@@modal/OPEN_MODAL',
  CLOSE_MODAL = '@@modal/CLOSE_MODAL'
}

export type ModalActionType = {
  type:
    | ModalActionTypes.OPEN_MODAL
    | ModalActionTypes.CLOSE_MODAL
}

export const changeLayout = (layout: string): LayoutActionType<string> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT,
  payload: layout,
})

export const changeLayoutColor = (color: string): LayoutActionType<string> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT_COLOR,
  payload: color,
})

export const changeLayoutWidth = (width: string): LayoutActionType<string> => ({
  type: LayoutActionTypes.CHANGE_LAYOUT_WIDTH,
  payload: width,
})

export const changeSidebarTheme = (
  sidebarTheme: string
): LayoutActionType<string> => ({
  type: LayoutActionTypes.CHANGE_SIDEBAR_THEME,
  payload: sidebarTheme,
})

export const changeSidebarType = (
  sidebarType: string
): LayoutActionType<string> => ({
  type: LayoutActionTypes.CHANGE_SIDEBAR_TYPE,
  payload: sidebarType,
})

export const showRightSidebar = (): LayoutActionType<null> => ({
  type: LayoutActionTypes.SHOW_RIGHT_SIDEBAR,
})

export const hideRightSidebar = (): LayoutActionType<null> => ({
  type: LayoutActionTypes.HIDE_RIGHT_SIDEBAR,
})

export const openModal = (): ModalActionType => ({
  type: ModalActionTypes.OPEN_MODAL,
})

export const closeModal = (): ModalActionType => ({
  type: ModalActionTypes.CLOSE_MODAL,
})

enum OrganizationActionType {
  GET_ORGANIZATION_INFORMATION = 'GET_ORGANIZATION_INFORMATION',
}

enum SiteActionType {
  GET_SITE_INFORMATION = 'GET_SITE_INFORMATION',
}

enum UserActionType {
  GET_USER_INFORMATION = 'GET_USER_INFORMATION',
}

enum ResourceActionType {
  GET_RESOURCE_INFORMATION = 'GET_RESOURCE_INFORMATION',
}

enum AggregatorActionType {
  GET_AGGREGATOR_INFORMATION = 'GET_AGGREGATOR_INFORMATION',
}

enum RowTableActionType {
  GET_CURRENT_TABLE_ROW_QUANTITIES = 'GET_CURRENT_TABLE_ROW_QUANTITIES',
}

enum AccordionActionType {
  GET_CURRENT_ACCORDION_INFORMATION = 'GET_CURRENT_ACCORDION_INFORMATION'
}

enum PreviousPageActionType {
  GET_CURRENT_PREVIOUS_PAGE_INFORMATION = 'GET_CURRENT_PREVIOUS_PAGE_INFORMATION',
}

enum MarketplaceActionType {
  GET_MARKETPLACE_INFORMATION = 'GET_MARKETPLACE_INFORMATION',
}

enum MarketplacerRelationshipActionType {
  GET_MARKETPLACE_RELATIONSHIPT_INFORMATION = 'GET_MARKETPLACE_RELATIONSHIPT_INFORMATION'
}

enum PagesInfoActionType {
  GET_ORGANIZATION_PAGE_INFORMATION = 'GET_ORGANIZATION_PAGE_INFORMATION',
  GET_SITE_PAGE_INFORMATION = 'GET_SITE_PAGE_INFORMATION',
  GET_SITE_LOCALE_PAGE_INFORMATION = 'GET_SITE_LOCALE_PAGE_INFORMATION',
  GET_WAREHOUSE_PAGE_INFORMATION = 'GET_WAREHOUSE_PAGE_INFORMATION',
  GET_WAREHOUSE_PAGE_SEARCH_DATA = 'GET_WAREHOUSE_PAGE_SEARCH_DATA',
  GET_PRODUCT_PAGE_INFORMATION = 'GET_PRODUCT_PAGE_INFORMATION',
  GET_PRODUCT_PAGE_SEARCH_DATA = 'GET_PRODUCT_PAGE_SEARCH_DATA',
  GET_AGGREGATOR_PAGE_INFORMATION = 'GET_AGGREGATOR_PAGE_INFORMATION',
  GET_MARKETPLACE_PAGE_INFORMATION = 'GET_MARKETPLACE_PAGE_INFORMATION',
  GET_AGGREGATOR_MARKETPLACE_PAGE_INFORMATION = 'GET_AGGREGATOR_MARKETPLACE_PAGE_INFORMATION',
  GET_RELATIONSHIP_PAGE_INFORMATION = 'GET_RELATIONSHIP_PAGE_INFORMATION',
  GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS = 'GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS',
  GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE = 'GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE',
  GET_ASSIGNED_PRODUCT_PAGE_SEARCH_DATA = 'GET_ASSIGNED_PRODUCT_PAGE_SEARCH_DATA',
  GET_ORDER_PAGE_SEARCH_DATA = 'GET_ORDER_PAGE_SEARCH_DATA',
  GET_LISTING_STATUS_PAGE_SEARCH_DATA = 'GET_LISTING_STATUS_PAGE_SEARCH_DATA',
  GET_MARKETPLACE_RELATIONSHIP_PAGE_SEARCH_DATA = 'GET_MARKETPLACE_RELATIONSHIP_PAGE_SEARCH_DATA',
  GET_USER_PAGE_SEARCH_DATA = 'GET_USER_PAGE_SEARCH_DATA',
  GET_MAPPINGS_PAGE_SEARCH_DATA = 'GET_MAPPINGS_PAGE_SEARCH_DATA',
  GET_DEFAULT_PROPERTY_VALUE_PAGE_SEARCH_DATA = 'GET_DEFAULT_PROPERTY_VALUE_PAGE_SEARCH_DATA',
  GET_PRODUCT_CATEGORY_MAPPINGS_PAGE_SEARCH_DATA = 'GET_PRODUCT_CATEGORY_MAPPINGS_PAGE_SEARCH_DATA',
  GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA = 'GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA',
  GET_PRODUCT_PROPERTY_MAPPINGS_PUSH_DATA = 'GET_PRODUCT_PROPERTY_MAPPINGS_PUSH_DATA',
  GET_SELECTED_PRODUCT_PROPERTY_MAPPING = 'GET_SELECTED_PRODUCT_PROPERTY_MAPPING',
  GET_COURIER_MAPPINGS_PAGE_SEARCH_DATA = 'GET_COURIER_MAPPINGS_PAGE_SEARCH_DATA',
  GET_ENUM_VALUE_MAPPINGS_SELECTED_DATA = 'GET_ENUM_VALUE_MAPPINGS_SELECTED_DATA',
  GET_RETURNS_REFUNDS_PAGE_SEARCH_DATA = 'GET_RETURNS_REFUNDS_PAGE_SEARCH_DATA',
  GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA = 'GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA',
}

enum NavigateActionType {
  GET_CURRENT_PAGE_SEO_NAME = 'GET_CURRENT_PAGE_SEO_NAME',
}

interface IOrganizationAction {
  type: OrganizationActionType
  payload: IOrganization
}

interface ISiteAction {
  type: SiteActionType
  payload: ISite
}

interface IUserAction {
  type: UserActionType
  payload: IUser
}

interface IResourceAction {
  type: ResourceActionType
  payload: IResource
}
interface IAggregatorAction {
  type: AggregatorActionType
  payload: IAggregator
}

interface IMarketplaceAction {
  type: MarketplaceActionType
  payload: IMarketplace
}

interface IMarketplaceRelationshipAction {
  type: MarketplacerRelationshipActionType
  payload: IMarketplaceRelationship
}

export type IRowTableActionType<TPayload> = {
  type: RowTableActionType.GET_CURRENT_TABLE_ROW_QUANTITIES
  payload: TPayload
}

export type IAccordionActionType<TPayload> = {
  type: AccordionActionType.GET_CURRENT_ACCORDION_INFORMATION
  payload: TPayload
}

export type IPreviousPageActionType<TPayload> = {
  type: PreviousPageActionType.GET_CURRENT_PREVIOUS_PAGE_INFORMATION
  payload: TPayload
}

export type IPagesInfoActionType<TPayload> = {
  type: PagesInfoActionType,
  payload: TPayload
}

export type INavigationAction<TPayLoad> = {
  type: NavigateActionType,
  payload: TPayLoad
}

export {
  OrganizationActionType,
  SiteActionType,
  UserActionType,
  ResourceActionType,
  RowTableActionType,
  AccordionActionType,
  AggregatorActionType,
  MarketplaceActionType,
  MarketplacerRelationshipActionType,
  PagesInfoActionType,
  NavigateActionType,
  PreviousPageActionType
}

export type {
  IOrganizationAction,
  ISiteAction,
  IUserAction,
  IResourceAction,
  IAggregatorAction,
  IMarketplaceAction,
  IMarketplaceRelationshipAction
}
