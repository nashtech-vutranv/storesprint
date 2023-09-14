import {
  ICurrency,
  IOrganization,
  ISite,
  ISiteLocale,
  IMarketplace,
  ISelectOption,
  IMappingType,
  IMappingMarketplace,
} from '../interface'

export const transformToSelectData = (
  originalData: IOrganization[] | ISite[] | ISiteLocale[] | ICurrency[] |
   IMarketplace[] | IMappingType[] | IMappingMarketplace[] | any,
  hasMarketplaceType?: boolean
): ISelectOption[] | any => {
  if (!hasMarketplaceType) {
     return originalData.map((item: any) => ({
       value: item.id,
       label: item.name,
     }))
  } else return originalData.map((item: any) => ({
    value: item.id,
    label: item.name,
    marketplaceTypeName: item.marketplaceType.name
  }))
}
