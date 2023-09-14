export const mapdata = (isAllDataFetched: boolean, searchData: any) => !isAllDataFetched
      ? searchData.map((org: any) => org.value)
      : []

export const getMapIdsResponse = (contents: any[]) => contents.map(item => item.id)