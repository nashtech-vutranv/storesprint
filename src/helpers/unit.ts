export const renderUnitType = (packageType: string) => {
    switch (packageType) {
      case 'package_length':
        return '(cm)'
      case 'package_height':
        return '(cm)'
      case 'package_width':
        return '(cm)'
      case 'package_weight':
        return '(kg)'
      default:
        return ''
    }
  }