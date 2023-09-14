import {MutableRefObject, useRef, createRef} from 'react'

type IconType = 'eyeSlash'

type IToggleHiding = (
  inputRef: MutableRefObject<HTMLInputElement>,
  iconRef: MutableRefObject<HTMLInputElement>,
  iconType: IconType
) => void

const handleChangeInputRefType = (
  inputRef: MutableRefObject<HTMLInputElement>
) => {
  switch (inputRef.current.type) {
    case 'password':
      inputRef.current.type = 'text'
      break
    default:
      inputRef.current.type = 'password'
  }
}

const handleChangeIconRefClassList = (
  iconRef: MutableRefObject<HTMLInputElement>,
  iconType: IconType
) => {
  const {classList} = iconRef.current
  switch (iconType) {
    case 'eyeSlash': {
      if (classList.contains('pi-eye')) {
        classList.replace('pi-eye', 'pi-eye-slash')
        return
      }
      if (classList.contains('pi-eye-slash')) {
        classList.replace('pi-eye-slash', 'pi-eye')
      }
      break
    }
    default:
  }
}

export const useSecretForm: (fieldQuantities: number) => {
  toggleHidingInput: IToggleHiding
  inputsRef: MutableRefObject<any>
  iconsRef: MutableRefObject<any>
} = (fieldQuantities) => {
  const inputsRef = useRef<any>(
    Array.apply(null, Array(fieldQuantities)).map((i) => createRef()))
  const iconsRef = useRef<any>(
    Array.apply(null, Array(fieldQuantities)).map((i) => createRef())
  )
  const toggleHidingInput = (
    inputRef: MutableRefObject<HTMLInputElement>,
    iconRef: MutableRefObject<HTMLInputElement>,
    iconType: IconType
  ) => {
    handleChangeInputRefType(inputRef)
    handleChangeIconRefClassList(iconRef, iconType)
  }

  return {
    inputsRef,
    iconsRef,
    toggleHidingInput,
  }
}
