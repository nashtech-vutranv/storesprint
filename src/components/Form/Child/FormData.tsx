import {MutableRefObject} from 'react'
import {Row, Col} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import classNames from 'classnames'
import {FormikTouched} from 'formik'
import {IFormResource, IResource} from '../../../interface/resource'

interface IDataForm {
  resourceId?: string
  isFormFieldValid: (name: keyof IFormResource) => string | false | undefined
  resource: IResource | null
  selectedOrganization: any
  selectedSite: any
  organizationsDropDownList: any[]
  sitesBySelectedOrganization: any[]
  onOrganizationsChange: (newValue: any) => void
  touched: FormikTouched<IFormResource>
  values: IFormResource
  handleOrganizationDropdownBlur: (event: any) => void
  onSitesChange: (newValue: any) => void
  handleSitesDropdownBlur: (event: any) => void
  siteRef: MutableRefObject<any>
}

const DataForm = (props: IDataForm) => {
  const {
    resourceId,
    isFormFieldValid,
    resource,
    selectedOrganization,
    selectedSite,
    organizationsDropDownList,
    sitesBySelectedOrganization,
    onOrganizationsChange,
    touched,
    values,
    handleOrganizationDropdownBlur,
    handleSitesDropdownBlur,
    onSitesChange,
    siteRef
  } = props

  const {t} = useTranslation()

  return (
    <>
      <Row className='align-items-center py-1 form-row-sm-mb'>
        <Col xs={4}>
          <label
            htmlFor='organizationId'
            className={classNames('required', {
              'p-error': isFormFieldValid('organizationId'),
            })}
          >
            {t('resource_form_organization')}
          </label>
        </Col>
        <Col xs={8} className='p-fluid'>
          {resourceId && (
            <Select
              placeholder={resource?.organizationResponse.name}
              className='react-select inherit-color'
              classNamePrefix='react-select'
              isDisabled={true}
            />
          )}
          {!resourceId && (
            <Select
              value={
                selectedOrganization
                  ? {
                      label: selectedOrganization.name,
                      value: selectedOrganization.id,
                    }
                  : null
              }
              options={organizationsDropDownList.map((org: any) => ({
                label: org.name,
                value: org.id,
              }))}
              placeholder={t(
                'resource_dropdown_organization_placeHolder'
              )}
              isSearchable
              onChange={onOrganizationsChange}
              className={`react-select inherit-color ${
                touched.organizationId && !values.organizationId
                  ? 'invalid-field'
                  : ''
              }`}
              classNamePrefix='react-select'
              onBlur={handleOrganizationDropdownBlur}
              isDisabled={false}
            />
          )}
        </Col>
        </Row>

        <Row className='align-items-center py-1 form-row-sm-mb'>
          <Col xs={4}>
            <label
              htmlFor='siteId'
              className={classNames('required', {
                'p-error': isFormFieldValid('siteId'),
              })}
            >
              {t('resource_form_site')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <Select
              value={
                selectedSite
                  ? {
                      label: selectedSite.name,
                      value: selectedSite.id,
                    }
                  : null
              }
              options={sitesBySelectedOrganization.map((site: any) => ({
                label: site.name,
                value: site.id,
              }))}
              placeholder={
                !resourceId
                  ? t('resource_dropdown_site_placeHolder')
                  : undefined
              }
              isSearchable
              onChange={onSitesChange}
              className={`react-select inherit-color ${
                touched.siteId && !selectedSite ? 'invalid-field' : ''
              }`}
              classNamePrefix='react-select'
              onBlur={handleSitesDropdownBlur}
              isDisabled={
                resource && resourceId && resource.siteResponse === null
                  ? true
                  : false
              }
              ref={siteRef}
            />
          </Col>
        </Row>

        <Row className='align-items-center py-1 form-row-md-mb'>
          <Col xs={4}>
            <label htmlFor='locale_name'>
              {t('resource_form_locale')}
            </label>
          </Col>
          <Col xs={8} className='p-fluid'>
            <div className='dropdown form-dropdown'>
              <Select
                placeholder={t('resource_dropdown_locale_placeHolder')}
                className='react-select inherit-color'
                classNamePrefix='react-select'
                isDisabled={true}
              />
            </div>
          </Col>
        </Row>
    </>
  )
}

export default DataForm
