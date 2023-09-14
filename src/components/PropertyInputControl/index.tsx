import {InputSwitch, InputSwitchChangeParams} from 'primereact/inputswitch'
import {InputText} from 'primereact/inputtext'
import {InputTextarea} from 'primereact/inputtextarea'
import {ChangeEvent, FocusEvent, useEffect, useState} from 'react'
import HyperDatepicker from '../Datepicker'

export type DateType =
  | 'Boolean'
  | 'Date'
  | 'Number'
  | 'String'
  | 'Long string'
  | ''
  | string

export interface IPropertyInputControlProps {
  type: DateType
  controlName: string
  onChange: (controlName: string, type: DateType, value: string) => void
  onBlur?: (controlName: string, type: DateType, value: string) => void
  classes?: string
  disabled?: boolean
  defaultValue: string
}

export default function PropertyInputControl(
  props: IPropertyInputControlProps
) {
  const {type, controlName, onChange, onBlur, classes, disabled, defaultValue} =
    props
  const [value, setValue] = useState<string>('')
  const [dateValue, setDateValue] = useState<Date>(new Date())

  useEffect(() => {
    if (defaultValue) {
      type === 'Date'
        ? setDateValue(new Date(defaultValue))
        : setValue(defaultValue)
    } else if (type === 'Boolean') {
      setValue('true')
      onChange(controlName, type, 'true')
    } else if (type === 'Date') {
      const newDate = new Date()
      setDateValue(newDate)
      onChange(controlName, type, newDate.toJSON())
    } else {
      setValue('')
      onChange(controlName, type, '')
    }
  }, [defaultValue, type])

  const onSwitchChange = (e: InputSwitchChangeParams) => {
    const formatValue = `${e.value}`
    setValue(formatValue)
    onChange(controlName, type, formatValue)
  }

  const onCommonTextChange = (e: any) => {
    const formatValue = e.target.value
    setValue(formatValue)
    onChange(controlName, type, formatValue)
  }

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onCommonTextChange(e)
  }

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onCommonTextChange(e)
  }

  const onCommonTextBlur = (e: any) => {
    const formatValue = e.target.value.trim()
    setValue(formatValue)
    onBlur && onBlur(controlName, type, formatValue)
  }

  const onTextBlur = (e: FocusEvent<HTMLInputElement>) => {
    onCommonTextBlur(e)
  }

  const onTextAreaBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    onCommonTextBlur(e)
  }

  const onDateChange = (date: Date) => {
    setDateValue(date)
    onChange(controlName, type, date.toJSON())
  }

  const getControl = () => {
    if (type === 'Boolean') {
      return (
        <InputSwitch
          name={controlName}
          checked={value}
          onChange={onSwitchChange}
          trueValue={'true'}
          falseValue={'false'}
          disabled={Boolean(disabled)}
        />
      )
    } else if (type === 'Date') {
      return (
        <HyperDatepicker
          value={dateValue}
          onChange={(date: Date) => onDateChange(date)}
          dateFormat={'dd/MM/yyyy'}
        />
      )
    } else if (type === 'Long string') {
      return (
        <InputTextarea
          name={controlName}
          value={value}
          onChange={onTextAreaChange}
          onBlur={onTextAreaBlur}
          className={`w-full p-1 ${classes}`}
          disabled={Boolean(disabled)}
        />
      )
    }

    return (
      <InputText
        name={controlName}
        value={value}
        type={type === 'Number' ? 'number' : 'text'}
        onChange={onTextChange}
        onBlur={onTextBlur}
        className={`w-full p-1 ${classes}`}
        disabled={Boolean(disabled)}
      />
    )
  }

  return <>{getControl()}</>
}
