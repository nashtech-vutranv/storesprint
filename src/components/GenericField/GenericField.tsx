import {FC, useState} from 'react'
import classNames from 'classnames'
import {InputText} from 'primereact/inputtext'
import {InputSwitch} from 'primereact/inputswitch'
import {InputTextarea} from 'primereact/inputtextarea'
import {PropertyType, IInputTextType} from '../../interface/products'
import HyperDatepicker from '../Datepicker'

type IKindOf = 'single' | 'list'

type ICbTextInSingle<E, S> = (e: E, selectedProp?: S) => void

type ICbTextInList<E, P> = (e: E, id: string, type: P) => void

type ICbBlurInSingle<E, S> = ICbTextInSingle<E, S>

type ICbBlurInList<E, P> = ICbTextInList<E, P>

interface IInputDataType<
  V = any,
  E = any,
  S = any,
  K = IKindOf,
  P = PropertyType
> {
  positionIn: K
  type: P
  value: V
  isDisabled?: boolean
  cbInSingle?: ICbTextInSingle<E, S>
  cbInList?: ICbTextInList<E, P>
  itemId?: string
  selectedProp?: S
  isFieldInvalid?: boolean
  cbBlurInSingle?: ICbBlurInSingle<E, S>
  cbBlurInList?: ICbBlurInList<E, P>
}

interface IInputSwitchInSingle<V = any, E = any, S = any> {
  value: V
  isDisabled?: boolean
  cbSwitch?: ICbTextInSingle<E, S>
  cbBlur?: ICbBlurInSingle<E, S>
}

interface IInputTextInSingle<V = any, E = any, S = any> {
  value: V
  dataType: IInputTextType
  isDisabled?: boolean
  cbText?: ICbTextInSingle<E, S>
  cbBlur?: ICbBlurInSingle<E, S>
  selectedProp?: any
  isFieldInvalid?: boolean
}

interface IInputSwitchInList<T = any, E = any, P = PropertyType> {
  value: T
  isDisabled?: boolean
  cbSwitch?: ICbTextInList<E, P>
  cbBlur?: ICbBlurInList<E, P>
  itemId?: string
  type: P
}

interface IInputTextInList<V = any, E = any, P = PropertyType> {
  value: V
  dataType: IInputTextType
  isDisabled?: boolean
  cbText?: ICbTextInList<E, P>
  cbBlur?: ICbBlurInList<E, P>
  itemId?: string
  type: P
  isFieldInvalid?: boolean
}

interface IInputDateInSingle {
  value: Date
  isDisabled?: boolean
  selectedProp?: any
  cbChange?: (date: string, selectedProp: any) => void
  cbBlur?: (
    event: React.FocusEvent<HTMLInputElement>,
    selectedProp: any
  ) => void
}

interface IInputDateInList {
  value: Date
  isDisabled?: boolean
  type: PropertyType
  itemId?: string
  cbChange?: (date: string, itemId: string, type: PropertyType) => void
  cbBlur?: (
    event: React.FocusEvent<HTMLInputElement>,
    itemId: string,
    type: PropertyType
  ) => void
}

interface IInputTextAreaInSingle<V = any, E = any, S = any>
  extends IInputTextInSingle<V, E, S> {}

interface IInputTextAreaInList<V = any, E = any, P = PropertyType>
  extends IInputTextInList<V, E, P> {}

const detectType = (dtType: IInputTextType) => {
  switch (dtType) {
    case 'Number':
      return 'number'
    case 'Long string':
      return 'text'
    case 'String':
      return 'text'
  }
}
const detectMaxLength = (dtType: IInputTextType) => {
  switch (dtType) {
    case 'Number':
      return 255
    case 'Long string':
      return 5000
    case 'String':
      return 255
  }
}

export const GenericInputField: FC<IInputDataType> = (props) => {
  const {
    positionIn,
    type,
    isDisabled,
    value,
    cbInSingle,
    cbInList,
    itemId,
    selectedProp,
    isFieldInvalid,
    cbBlurInList,
    cbBlurInSingle,
  } = props
  switch (positionIn) {
    case 'single': {
      if (type === 'Boolean') {
        return (
          <GenericSingleInputSwitch
            isDisabled={isDisabled}
            value={value}
            cbSwitch={cbInSingle}
            cbBlur={cbBlurInSingle}
          />
        )
      }
      if (type === 'Date') {
        return (
          <GenericSingleInputDate
            isDisabled={isDisabled}
            value={value}
            selectedProp={selectedProp}
            cbChange={cbInSingle}
            cbBlur={cbBlurInSingle}
          />
        )
      } 
      if (type === 'Long string') {
        return (
          <GenericSingleInputTextArea
            isDisabled={isDisabled}
            value={value}
            dataType={type}
            cbText={cbInSingle}
            cbBlur={cbBlurInSingle}
            selectedProp={selectedProp}
            isFieldInvalid={isFieldInvalid}
          />
        )
      } else {
        return (
          <GenericSingleInputText
            isDisabled={isDisabled}
            value={value}
            dataType={type}
            cbText={cbInSingle}
            cbBlur={cbBlurInSingle}
            selectedProp={selectedProp}
            isFieldInvalid={isFieldInvalid}
          />
        )
      }
    }
    case 'list': {
      if (type === 'Boolean') {
        return (
          <GenericInputSwitchInList
            isDisabled={isDisabled}
            value={value}
            cbSwitch={cbInList}
            cbBlur={cbBlurInList}
            type={type}
            itemId={itemId}
          />
        )
      }
      if (type === 'Date') {
        return (
          <GenericInputDateInList
            isDisabled={isDisabled}
            value={value}
            itemId={itemId}
            type={type}
            cbChange={cbInList}
            cbBlur={cbBlurInList}
          />
        )
      } 
      if (type === 'Long string') {
        return (
          <GenericInputTextAreaInList
            isDisabled={isDisabled}
            value={value}
            dataType={type}
            cbText={cbInList}
            cbBlur={cbBlurInList}
            itemId={itemId}
            type={type}
            isFieldInvalid={isFieldInvalid}
          />
        )
      } else {
        return (
          <GenericInputTextInList
            isDisabled={isDisabled}
            value={value}
            dataType={type}
            cbText={cbInList}
            cbBlur={cbBlurInList}
            itemId={itemId}
            type={type}
            isFieldInvalid={isFieldInvalid}
          />
        )
      }
    }
  }
}

export const GenericSingleInputSwitch: FC<IInputSwitchInSingle> = (props) => {
  const {isDisabled, value, cbSwitch, cbBlur} = props
  const handleChange = (e: any) => {
    cbSwitch && cbSwitch(e)
  }
  const handleBlur = (e: any) => {
    cbBlur && cbBlur(e)
  }

  return (
    <InputSwitch
      checked={Boolean(value)}
      disabled={isDisabled}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

export const GenericSingleInputText: FC<IInputTextInSingle> = (props) => {
  const {
    isDisabled,
    cbText,
    dataType,
    selectedProp,
    isFieldInvalid,
    value,
    cbBlur,
  } = props
  const handleChange = (e: any) => {
    cbText && cbText(e, selectedProp)
  }
  const handleBlur = (e: any) => {
    cbBlur && cbBlur(e, selectedProp)
  }

  return (
    <InputText
      disabled={isDisabled}
      onChange={handleChange}
      type={detectType(dataType)}
      value={value}
      className={classNames('w-full p-1', {
        'p-invalid': isFieldInvalid,
      })}
      onBlur={handleBlur}
      maxLength={detectMaxLength(dataType)}
    />
  )
}

export const GenericSingleInputDate: FC<IInputDateInSingle> = (props) => {
  const {isDisabled, value, selectedProp, cbChange, cbBlur} = props
  const [dateValue, setDateValue] = useState<Date>(
    value ? new Date(value) : new Date()
  )
  const onDateChange = (date: Date) => {
    setDateValue(date)
    cbChange && cbChange(date.toJSON(), selectedProp)
  }

  const onDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    cbBlur && cbBlur(e, selectedProp)
  }

  return (
    <HyperDatepicker
      value={dateValue}
      dateFormat={'dd/MM/yyyy'}
      disabled={isDisabled}
      onChange={(date: Date) => onDateChange(date)}
      onBlur={onDateBlur}
    />
  )
}

export const GenericSingleInputTextArea: FC<IInputTextAreaInSingle> = (
  props
) => {
  const {
    isDisabled,
    cbText,
    dataType,
    selectedProp,
    isFieldInvalid,
    value,
    cbBlur,
  } = props
  const handleChange = (e: any) => {
    cbText && cbText(e, selectedProp)
  }
  const handleBlur = (e: any) => {
    cbBlur && cbBlur(e, selectedProp)
  }

  return (
    <InputTextarea
      disabled={isDisabled}
      onChange={handleChange}
      value={value}
      className={classNames('w-full p-1', {
        'p-invalid': isFieldInvalid,
      })}
      onBlur={handleBlur}
      maxLength={detectMaxLength(dataType)}
    />
  )
}

export const GenericInputSwitchInList: FC<IInputSwitchInList> = (props) => {
  const {isDisabled, value, cbSwitch, itemId, type, cbBlur} = props
  const handleChange = (e: any) => {
    cbSwitch && itemId && cbSwitch(e, itemId, type)
  }

  const handleBlur = (e: any) => {
    cbBlur && itemId && cbBlur(e, itemId, type)
  }

  return (
    <InputSwitch
      checked={Boolean(value)}
      disabled={isDisabled}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

export const GenericInputTextInList: FC<IInputTextInList> = (props) => {
  const {
    isDisabled,
    value,
    cbText,
    dataType,
    itemId,
    type,
    isFieldInvalid,
    cbBlur,
  } = props
  const handleChange = (e: any) => {
    cbText && itemId && cbText(e, itemId, type)
  }

  const handleBlur = (e: any) => {
    cbBlur && itemId && cbBlur(e, itemId, type)
  }

  return (
    <InputText
      disabled={isDisabled}
      value={value}
      onChange={handleChange}
      type={detectType(dataType)}
      className={classNames('w-full p-1', {
        'p-invalid': isFieldInvalid,
      })}
      onBlur={handleBlur}
      maxLength={detectMaxLength(dataType)}
    />
  )
}

export const GenericInputDateInList: FC<IInputDateInList> = (props) => {
  const {isDisabled, value, cbChange, cbBlur, itemId, type} = props
  const [dateValue, setDateValue] = useState<Date>(
    value ? new Date(value) : new Date()
  )
  const onDateChange = (date: Date) => {
    setDateValue(date)
    cbChange && cbChange(date.toJSON(), itemId!, type)
  }

  const onDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    cbBlur && cbBlur(e, itemId!, type)
  }

  return (
    <HyperDatepicker
      value={dateValue}
      dateFormat={'dd/MM/yyyy'}
      disabled={isDisabled}
      onChange={(date: Date) => onDateChange(date)}
      onBlur={onDateBlur}
    />
  )
}

export const GenericInputTextAreaInList: FC<IInputTextAreaInList> = (props) => {
  const {
    isDisabled,
    value,
    cbText,
    dataType,
    itemId,
    type,
    isFieldInvalid,
    cbBlur,
  } = props
  const handleChange = (e: any) => {
    cbText && itemId && cbText(e, itemId, type)
  }

  const handleBlur = (e: any) => {
    cbBlur && itemId && cbBlur(e, itemId, type)
  }

  return (
    <InputTextarea
      disabled={isDisabled}
      value={value}
      onChange={handleChange}
      className={classNames('w-full p-1', {
        'p-invalid': isFieldInvalid,
      })}
      onBlur={handleBlur}
      maxLength={detectMaxLength(dataType)}
    />
  )
}
