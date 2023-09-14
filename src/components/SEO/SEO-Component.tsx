import {Helmet} from 'react-helmet'

export const SeoConfig = (props: any) => {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{props.seoProperty} - MMS</title>
      </Helmet>
    </>
  )
}

export default SeoConfig
