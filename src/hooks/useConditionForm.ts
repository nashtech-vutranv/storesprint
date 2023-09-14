import {useState, SetStateAction, ChangeEventHandler, ChangeEvent} from 'react'
import {InputSwitchChangeParams} from 'primereact/inputswitch'
import {OnChangeValue, ActionMeta} from 'react-select'

export const useConditionForm: (
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void
  },
  formatInputSwich?: (e: InputSwitchChangeParams) => void,
  handleSelectChange?: <Option, IsMulti extends boolean>(
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void
) => {
  isSaveButtonDisabled: boolean
  setIsSaveButtonDisabled: (value: SetStateAction<boolean>) => void
  onInputChange: ChangeEventHandler<HTMLInputElement>
  onSwitchChange: (e: InputSwitchChangeParams) => void
  onSelectChange?: <Option, IsMulti extends boolean>(
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void
} = (handleChange, formatInputSwitch, handleSelectChange) => {
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(true)

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    handleChange(e)
  }

  const onSwitchChange = (e: InputSwitchChangeParams) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    handleChange(e)
    formatInputSwitch && formatInputSwitch(e)
  }

  const onSelectChange = <Opt>(selectValue: any, action: ActionMeta<Opt>) => {
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false)
    }
    handleSelectChange && handleSelectChange(selectValue, action)
  }

  return {
    isSaveButtonDisabled,
    setIsSaveButtonDisabled,
    onInputChange,
    onSwitchChange,
    onSelectChange,
  }
}