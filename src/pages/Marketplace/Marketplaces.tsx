import {Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import PageTitle from '../../components/PageTitle/PageTitle'
import {MarketplaceTable} from '../../components/Marketplace'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'

export default function Marketplaces() {
  const {t} = useTranslation()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.marketplaces}></SeoConfig>
      <Row>
        <PageTitle title={t('marketplace_title')} />

        <MarketplaceTable />
      </Row>
    </>
  )
}
