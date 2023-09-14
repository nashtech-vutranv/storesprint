import queryString from 'query-string'
import _ from 'lodash'
import {ISelectUrlParam, ParamType, CommonStateUrlParams} from '../interface'
import {initialUrlParams} from './initialState'

export const getURLParamsObj = () => {
  if (_.isEmpty(window.location.search)) {
    return initialUrlParams
  }
  return queryString.parse(decodeURIComponent(window.location.search), {
    arrayFormat: 'comma',
  })
}

export const decodeParam = (key: CommonStateUrlParams, searchParams: any) => {
  if (searchParams.get(key)) {
    return decodeURIComponent(searchParams.get(key) as string)
  } else return null
}

export const extractEncodeUrl = (encodeUriObj: any) => {
  var str = ''
  for (var key in encodeUriObj) {
    if (str !== '') {
      str += '&'
    }
    str += key + '=' + encodeUriObj[key]
  }
  return str
}

export const decodeUrlString = (urlString: string, symbol: string, isMulti: boolean) => {
  if (!isMulti) return decodeURIComponent(urlString)
  return urlString.split(symbol).map((char) => decodeURIComponent(char))
}

export const getSelectParamObj: (type: ParamType) => {
  label: ISelectUrlParam
  value: ISelectUrlParam
} = (type) => {
  switch (type) {
    case 'org':
      return {
        label: 'orgLs',
        value: 'orgVs',
      }
    case 'site':
      return {
        label: 'siteLs',
        value: 'siteVs',
      }
    case 'locale':
      return {
        label: 'localeLs',
        value: 'localeVs',
      }
    case 'mrk': 
      return {
        label: 'mrkLs',
        value: 'mrkVs'
      }
    case 'ros': 
      return {
        label: 'rosLs',
        value: 'rosVs'
      }
    case 'st': {
      return {
        label: 'stLs',
        value: 'stVs'
      }
    }
    case 'marketplaceType': {
      return {
        label: 'marketplaceTypeLabel',
        value: 'marketplaceTypeValue'
      }
    }
    case 'property': {
      return {
        label: 'propertyLabels',
        value: 'propertyValues'
      }
    }
    case 'productCategory': {
      return {
        label: 'pcLs',
        value: 'pcVs'
      }
    }
    case 'listingStatus': {
      return {
        label: 'lsLs',
        value: 'lsVs'
      }
    }
    default:
      return {
        label: 'orgLs',
        value: 'orgVs',
      }
  }
}
