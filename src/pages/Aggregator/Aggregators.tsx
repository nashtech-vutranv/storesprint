import React from 'react'
import {Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {AggregatorTable} from '../../components/Aggregator'
import PageTitle from '../../components/PageTitle/PageTitle'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'

export default function App() {
  const {t} = useTranslation()

  return (
    <>
      <SeoConfig seoProperty={seoProperty.aggregators}></SeoConfig>
      <Row>
        <PageTitle title={t('aggregator_title')} />

        <AggregatorTable />
      </Row>
    </>
  )
}
