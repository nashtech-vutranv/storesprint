import {useSearchParams} from 'react-router-dom'
import {getSelectParamObj} from '../helpers'
import {ISelectUrlParam, ParamType} from '../interface'

export const useSelectUrlParams = (
  urlParamKeys: [ISelectUrlParam, ISelectUrlParam],
  selectType: ParamType
) => {
  const [searchParams] = useSearchParams()

  const tranformParamsObjToSelectData = (
    decodeParamsObj: any,
    type: ParamType
  ) => {
    const paramSelectObj = getSelectParamObj(type)
    if (Array.isArray(decodeParamsObj[paramSelectObj.label])) {
      return decodeParamsObj[paramSelectObj.label].map(
        (item: any, idx: number) => ({
          label: item,
          value: decodeParamsObj[paramSelectObj.value][idx],
        })
      )
    }
    return {
      label: decodeParamsObj[paramSelectObj.label],
      value: decodeParamsObj[paramSelectObj.value],
    }
  }

  const decodeParams = (keys: [ISelectUrlParam, ISelectUrlParam]) => {
    let decodeParamsObj: any = {}
    keys.forEach((key) => {
      const encodeParams = searchParams.getAll(key).map(chars => decodeURIComponent(chars))
      const listParamValues = encodeParams.length === 1 ? encodeParams[0].split(',') : encodeParams
        decodeParamsObj[key] = listParamValues
        
    })
    return tranformParamsObjToSelectData(decodeParamsObj, selectType)
  }

  return decodeParams(urlParamKeys)
}