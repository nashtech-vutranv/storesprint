import {Row, Col} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'

const Footer = () => {
  const {t} = useTranslation()
  return (
    <footer className='footer'>
      <div className='container-fluid'>
        <Row>
          <Col md={6}>
            <span>
              {t('footer_version')}: {process.env.REACT_APP_VERSION}
            </span>
          </Col>

          <Col md={6}>
            <div className='text-md-end footer-links d-none d-md-block'>
              {/* <Link to='#'>{t('footer_info_about')}</Link>
              <Link to='#'>{t('footer_info_support')}</Link>
              <Link to='#'>{t('footer_info_contact_us')}</Link> */}
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer
