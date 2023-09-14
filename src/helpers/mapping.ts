import _, {last} from 'lodash'

const isDataIsFulfilledInLastRow = (
  mmsValues: string[],
  marketplaceValues: string[]
  ) => {
  if (last(mmsValues) === '' || last(marketplaceValues) === '') {
    return false
  }
  return true
}

const isMappingTargetSelected = (
  selectedMappingType: any,
  selectedMarketplace: any
) => {
  if (_.isEmpty(selectedMappingType) || _.isEmpty(selectedMarketplace)) return false
  return true
}

const isDisableAddNewMappingButton = (
  mmsValues: string[],
  marketplaceValues: string[],
  selectedMappingType: any,
  selectedMarketplace: any
) => {
  if (!isDataIsFulfilledInLastRow(mmsValues, marketplaceValues)
   || !isMappingTargetSelected(selectedMappingType, selectedMarketplace)
  ) {
    return true
  }
  return false
}

export {isDisableAddNewMappingButton}