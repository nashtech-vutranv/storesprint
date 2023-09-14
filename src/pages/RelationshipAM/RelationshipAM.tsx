import {Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import PageTitle from '../../components/PageTitle/PageTitle'
import {RelationshipAMTable} from '../../components/RelationshipAM'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'

export default function RelationshipAM() {
  const {t} = useTranslation()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.relationshipAM}></SeoConfig>
      <Row>
        <PageTitle title={t('relationshipAM_title')} />

        <RelationshipAMTable />
      </Row>
    </>
  )
}
