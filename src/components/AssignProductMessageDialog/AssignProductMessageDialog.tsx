import {FC} from 'react'
import {useTranslation} from 'react-i18next'

interface IAssignProductMessageDialog {
  totalProducts: number
  assigningMarketplaces: string[]
  removingMarketplaces: string[]
}

const AssignProductMessageDialog: FC<IAssignProductMessageDialog> = (props) => {
  const {
    totalProducts,
    assigningMarketplaces,
    removingMarketplaces
  } = props

  const {t} = useTranslation()

  return (
    <div>
      <div>
        {
          totalProducts > 0 &&
          t('assigned_products_confirm_message_total_products_start') 
          + totalProducts
          + `${totalProducts > 1
          ? t('assigned_products_confirm_message_total_products_end_multiple')
          : t('assigned_products_confirm_message_total_products_end_single')}`
        }
      </div>
      <div>
        {
          assigningMarketplaces.length > 0
            && t('assigned_products_confirm_message_assigning_start') 
            + assigningMarketplaces.length
            + `${assigningMarketplaces.length > 1 
              ? t('assigned_products_confirm_message_assigning_semi_multiple')
              + assigningMarketplaces.slice(0, assigningMarketplaces.length - 1).join(', ')
              + t('assigned_products_confirm_message_assigning_center')
              + assigningMarketplaces[assigningMarketplaces.length - 1]
              + t('assigned_products_confirm_message_assigning_end')
              : t('assigned_products_confirm_message_assigning_semi_single')
              + assigningMarketplaces[0]
              + t('assigned_products_confirm_message_assigning_end') 
            }`
        }
      </div>
      <div>
        {
          removingMarketplaces.length > 0
            && t('assigned_products_confirm_message_removing_start') 
            + removingMarketplaces.length
            + `${removingMarketplaces.length > 1 
              ? t('assigned_products_confirm_message_removing_center_multiple')
              + removingMarketplaces.slice(0, removingMarketplaces.length - 1).join(', ')
              + t('assigned_products_confirm_message_removing_center_and')
              + removingMarketplaces[removingMarketplaces.length - 1]
              + t('assigned_products_confirm_message_removing_end')
              : t('assigned_products_confirm_message_removing_center_single')
              + removingMarketplaces[0]
              + t('assigned_products_confirm_message_removing_end') 
            }`
        }
      </div>
    </div>
  )
}

export default AssignProductMessageDialog
