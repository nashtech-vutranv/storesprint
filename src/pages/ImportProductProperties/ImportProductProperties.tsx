import classNames from 'classnames'
import {ChangeEvent, useContext, useRef, useState} from 'react'
import {Button, Card, Col, ProgressBar, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {useCallbackPrompt, useHandleError} from '../../hooks'
import {
  BAD_REQUEST_ERROR,
  ROUTE_IMPORT_PRODUCT_PROPERTIES,
  ROUTE_PRODUCT_PROPERTIES,
} from '../../constants'
import ImportProductPropertiesService from '../../services/ImportProductPropertiesService'
import {GlobalContext} from '../../store/GlobalContext'

const CSV_TYPE = 'text/csv'
const MAX_FILE_SIZE = 2 * 1024 * 1024

const ImportProductProperties = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef<any>()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const isFormDirtyRef = useRef<boolean>(false)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isAllowOverride, setIsAllowOverride] = useState<boolean>(false)
  const [fileError, setFileError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [percent, setPercent] = useState(0)

  const {
    state: {axiosClient},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const handleOpenBrowseFileDialog = () => {
    fileInputRef.current.click()
    if (!isFormDirtyRef.current) {
      isFormDirtyRef.current = true
    }
  }
  const handleFileChange = () => {
    const file = fileInputRef.current.files[0] as File
    if (!file || (file && file.type !== CSV_TYPE)) return

    setSelectedFile(file)
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError(t('import_product_properties_maximum_file_size_exceeded'))
      return
    }
    setFileError('')
  }

  const handleChangeAllowOverride = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isFormDirtyRef.current) {
      isFormDirtyRef.current = true
    }
    setIsAllowOverride(e.target.checked)
  }

  const handleImport = async () => {
    try {
      isFormDirtyRef.current = false
      setIsProcessing(true)
      setPercent(80)
      const response = await new ImportProductPropertiesService(
        axiosClient
      ).importProductProperties(fileInputRef.current.files[0], isAllowOverride)
      setPercent(100)
      setIsSubmitSuccess(true)
      setIsProcessing(false)
      navigate(ROUTE_IMPORT_PRODUCT_PROPERTIES.RESULT, {
        state: response.data,
      })
    } catch (err: any) {
      setIsProcessing(false)
      if (
        err.response.data.status === BAD_REQUEST_ERROR &&
        err.response.data.errorCode === 'OVER_MAXIMUM_IMPORT_NUMBER'
      ) {
        setFileError(t('import_product_properties_exceeded_500_records'))
      } else {
        handleErrorResponse(err)
      }
    }
  }
  useCallbackPrompt(!isSubmitSuccess && isFormDirtyRef.current)

  return (
    <>
      <SeoConfig seoProperty={seoProperty.importProductProperties}></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>
            {t('import_product_properties_title')}
          </h4>
        </Card.Header>
        <Card.Body>
          <div className='d-flex align-items-center'>
            <Button
              type='button'
              variant='success'
              disabled={isProcessing}
              onClick={handleOpenBrowseFileDialog}
            >
              {t('import_product_properties_choose_file')}
            </Button>
            <div
              style={{
                marginLeft: '0.75rem',
                display: 'inline-block',
                maxWidth: '500px',
              }}
            >
              <div>{selectedFile?.name}</div>
              {fileError && (
                <div className='text-danger' style={{fontSize: '0.75rem'}}>
                  {fileError}
                </div>
              )}
            </div>
            <div
              style={{
                marginLeft: '1.5rem',
                width: '100%',
                maxWidth: '300px',
                transition: 'visibility ease-out 0.3s',
              }}
              className={classNames(isProcessing ? 'visible' : 'invisible')}
            >
              <ProgressBar
                className=' progress-sm'
                now={percent}
                variant='success'
                animated
              ></ProgressBar>
            </div>

            <input
              type='file'
              ref={fileInputRef}
              className='d-none'
              onChange={handleFileChange}
              accept={CSV_TYPE}
            />
          </div>
          <div className='d-flex mt-2'>
            <input
              type='checkbox'
              name='allowOverride'
              id='allowOverride'
              onChange={handleChangeAllowOverride}
              checked={isAllowOverride}
            />
            <label
              htmlFor='allowOverride'
              className='d-inline-block'
              style={{marginLeft: '0.75rem'}}
            >
              {t('import_product_properties_allow_override')}
            </label>
          </div>
          <Row>
            <Col xs={{span: 8, offset: 4}}>
              <Button
                className='me-2'
                onClick={() => navigate(ROUTE_PRODUCT_PROPERTIES.ROOT)}
                variant='danger'
              >
                {t('common_confirm_cancel')}
              </Button>
              <Button
                variant='success'
                className='me-2'
                onClick={handleImport}
                disabled={isProcessing || !selectedFile || Boolean(fileError)}
              >
                {t('common_submit')}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default ImportProductProperties
