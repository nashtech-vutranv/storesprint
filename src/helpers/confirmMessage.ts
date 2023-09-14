export const assigningMarketplacesMessage: (listMarketplacesInDialog: any, selectedProducts: any) 
=> string[] = (
  listMarketplacesInDialog, selectedProducts
  ) => {
  return listMarketplacesInDialog.filter((item: any) => item.assignedStatus === 'ASSIGNED')
    .filter((it: any) => {
      if (selectedProducts.length > 1) {
        return selectedProducts.reduce((pre: any, cur: any) => {
          if (typeof pre === 'boolean') {
            if (pre) {
              return true
            } else {
              if (!cur.marketplaces) {
                return true
              }
              if (!cur.marketplaces.some((mrk: any) => mrk.id === it.id)) {
                return true
              } else return false
            }
          }
          else {
            if (
              !pre.marketplaces || !cur.marketplaces ||
              !pre.marketplaces.some((mrk: any) => mrk.id === it.id)
              || !cur.marketplaces.some((mrk: any) => mrk.id === it.id)) {
              return true
            } else return false
          }
        })
      } else {
        if (!selectedProducts[0].marketplaces) return true
        return !selectedProducts[0].marketplaces.some((mrk: any) => mrk.id === it.id)
      }
    }).map((it: any) => it.name)
}