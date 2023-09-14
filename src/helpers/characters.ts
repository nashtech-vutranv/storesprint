type GenerateType =
  | 'number'
  | 'upperCaseAlpha'
  | 'lowerCaseAlpha'
  | 'upperCaseAlpha_number'
  | 'lowerCaseAlpha_number'

const generateCharacters = (length: number, type?: GenerateType) => {
  let characters = null
  switch (type) {
    case 'upperCaseAlpha':
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      break
    case 'lowerCaseAlpha':
      characters = 'abcdefghijklmnopqrstuvwxyz'
      break
    case 'upperCaseAlpha_number':
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      break
    case 'lowerCaseAlpha_number':
      characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
      break
    case 'number':
      characters = '0123456789'
      break
    default:
      characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const capitalizeFirstLetter = (str: string) => {
  if (checkInvalidString(str)) {
    return ''
  }
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

const normallizeExceptFirstLetter = (str: string) => {
  if (checkInvalidString(str)) {
    return ''
  }
  return str.charAt(0) + str.slice(1).toLocaleLowerCase()
}

const checkInvalidString = (str: string) => {
  const invalidData = [null, '', undefined]
  return invalidData.includes(str)
}

export {generateCharacters, capitalizeFirstLetter, normallizeExceptFirstLetter}
