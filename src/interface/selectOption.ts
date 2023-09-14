import {PropertyType} from './products'

interface ISelectOption {
  value: string
  label: string
}

interface IPropertyOption extends ISelectOption {
  type: PropertyType
  erpId: string
}

interface ICreateTableSelectOption extends Omit<ISelectOption, 'value'> {
  value: string | null
}

export type {ISelectOption, IPropertyOption, ICreateTableSelectOption}
