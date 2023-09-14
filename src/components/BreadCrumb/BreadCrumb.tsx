import {Breadcrumb} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {ROUTE_ORG, ROUTE_USER, ROUTE_PRODUCT_CATEGORY_MAPPINGS} from '../../constants'

type IOrigins = 'users' | 'productCategoryMapping' | 'productPropertyMapping'

export type BreadcrumbItems = {
  label: string
  path?: string
  active?: boolean
}

type BreadCrumbProps = {
  breadCrumbItems: BreadcrumbItems[]
  origin?: IOrigins,
  persistState?: any
}

const BreadCrumb = ({breadCrumbItems, origin, persistState}: BreadCrumbProps) => {
  const {t} = useTranslation()

  return (
    <Breadcrumb listProps={{className: 'm-0'}}>
      {!origin && (
        <Breadcrumb.Item linkAs={Link} linkProps={{to: ROUTE_ORG.ROOT}}>
          <span>{t('navigator_title_organizations')}</span>
        </Breadcrumb.Item>
      )}

      {origin === 'users' && (
        <Breadcrumb.Item linkAs={Link} linkProps={{to: ROUTE_USER.ROOT}}>
          <span>{t('navigator_title_users')}</span>
        </Breadcrumb.Item>
      )}

      {origin === 'productCategoryMapping' && (
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{to: ROUTE_PRODUCT_CATEGORY_MAPPINGS.ROOT, state: persistState}}
        >
          <span>{t('product_category_mappings_page_title')}</span>
        </Breadcrumb.Item>
      )}

      {breadCrumbItems.map((item: any, index: number) => {
        return item.active ? (
          <Breadcrumb.Item active key={index}>
            <span> {item.label} </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item
            key={index}
            linkAs={Link}
            linkProps={{to: item.path}}
          >
            <span> {item.label} </span>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default BreadCrumb
