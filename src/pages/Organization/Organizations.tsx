import {Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import OrganizationTable from '../../components/Organization'
import PageTitle from '../../components/PageTitle/PageTitle'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'

const Organizations = () => {
  const {t} = useTranslation()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.organizations}></SeoConfig>
      <Row>
        <PageTitle title={t('organization_title')} />

        <OrganizationTable />
      </Row>
    </>
  )
}

export default Organizations
