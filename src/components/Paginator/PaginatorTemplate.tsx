import {Fragment, ChangeEventHandler, KeyboardEvent, useContext, useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {Ripple} from 'primereact/ripple'
import {classNames} from 'primereact/utils'
import {Dropdown, DropdownChangeParams} from 'primereact/dropdown'
import {InputText} from 'primereact/inputtext'
import {
  PaginatorTemplate,
  PaginatorCurrentPageReportOptions,
} from 'primereact/paginator'
import {Tooltip} from 'primereact/tooltip'
import {Slider} from 'primereact/slider'
import {GlobalContext} from '../../store/GlobalContext'
import {conditionLink} from '../../helpers/conditionLink'

const sampleCurrentPageReport = (options: any) => {
    return (
      <span
        style={{
          userSelect: 'none',
          width: '120px',
          textAlign: 'center',
        }}
      >
        {options.first} - {options.last} of {options.totalRecords}
      </span>
    )
  }

const TemplatePaginator = (
  templateName:
    | 'sample_alpha'
    | 'sample_beta'
    | 'sample_gamma'
    | 'sample_delta'
    | 'sample_lamda',
  currentPage?: number,
  pageInputTooltip?: string,
  onPageInputKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>,
    option: PaginatorCurrentPageReportOptions
  ) => void,
  onPageInputChange?: ChangeEventHandler<HTMLInputElement>
): PaginatorTemplate | undefined => {
  const {t} = useTranslation()
  const {
    state: {rowTable},
  } = useContext(GlobalContext)
  const [isPageDropDownFocused, setIsPageDropDownFocused] = useState<boolean>(false)

  useEffect(() => {
    if (isPageDropDownFocused) {
      document.querySelectorAll('[role="listbox"]').forEach((el) => {
      el.setAttribute('aria-label', 'dropdown-items')
    })
    }
  }, [isPageDropDownFocused])

  const pageLinks = (options: any) => {
    if (
      conditionLink(options)
    ) {
      const className = classNames(options.className, {
        'p-disabled': true,
      })

      return (
        <span className={className} style={{userSelect: 'none'}}>
          ...
        </span>
      )
    }

    return (
      <button
        type='button'
        className={options.className}
        onClick={options.onClick}
      >
        {options.page + 1}
        <Ripple />
      </button>
    )
  }

  const prevPageLink = (options: any) => {
    return (
      <button
        type='button'
        className={options.className}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className='p-3'>
          {t('organization_paginator_previous')}
        </span>
        <Ripple />
      </button>
    )
  }

  const nextPageLink = (options: any) => {
    return (
      <button
        type='button'
        className={options.className}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className='p-3'>
          {t('organization_paginator_next')}
          </span>
        <Ripple />
      </button>
    )
  }

  switch (templateName) {
    case 'sample_alpha': {
      return {
        layout:
          'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: prevPageLink,
        NextPageLink: nextPageLink,
        PageLinks: pageLinks,
        RowsPerPageDropdown: (options) => {
          const dropdownOptions = [
            {label: 10, value: 10},
            {label: 20, value: 20},
            {label: 50, value: 50},
            {label: 'All', value: options.totalRecords},
          ]

          return (
            <Dropdown
              value={options.value}
              options={dropdownOptions}
              onChange={options.onChange}
              disabled={options.disabled}
            />
          )
        },
        CurrentPageReport: (options) => {
          return (
            <span className='mx-3' style={{userSelect: 'none'}}>
              {t('organization_paginator_page_goto')}
              <InputText
                size={2}
                className='ml-1'
                value={currentPage}
                tooltip={pageInputTooltip}
                onKeyDown={(e) =>
                  onPageInputKeyDown && onPageInputKeyDown(e, options)
                }
                onChange={onPageInputChange}
              />
            </span>
          )
        },
        FirstPageLink: null,
        LastPageLink: null,
        JumpToPageInput: null,
      }
    }
    case 'sample_beta':
      return {
        layout:
          'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        RowsPerPageDropdown: (options: any) => {
          const dropdownOptions = [
            {label: 10, value: 10},
            {label: 25, value: 25},
            {label: 50, value: 50},
          ]

          return (
            <Fragment>
              <span className='mx-1' style={{userSelect: 'none'}}>
                {t('organization_paginator_page_items')}:{' '}
              </span>
              <Dropdown
                value={options.value}
                options={dropdownOptions}
                onChange={options.onChange}
                disabled={options.disabled}
              />
            </Fragment>
          )
        },
        CurrentPageReport: sampleCurrentPageReport,
        FirstPageLink: null,
        PrevPageLink: null,
        NextPageLink: null,
        PageLinks: null,
        LastPageLink: null,
        JumpToPageInput: null,
      }
    case 'sample_gamma': {
      return {
        layout:
          'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
        RowsPerPageDropdown: (options: any) => {
          return (
            <div className='d-flex align-items-center'>
              <Tooltip
                target='.slider>.p-slider-handle'
                content={`${options.value} / page`}
                position='top'
                event='focus'
              />

              <span className='mr-3' style={{userSelect: 'none'}}>
                {t('organization_paginator_page_items')}:{' '}
              </span>
              <Slider
                className='slider'
                value={options.value}
                onChange={options.onChange}
                min={10}
                max={120}
                step={30}
                style={{width: '10rem'}}
                disabled={options.disabled}
              />
            </div>
          )
        },
        CurrentPageReport: sampleCurrentPageReport,
        FirstPageLink: null,
        PrevPageLink: null,
        NextPageLink: null,
        PageLinks: null,
        LastPageLink: null,
        JumpToPageInput: null,
      }
    }
    case 'sample_delta': {
      return {
        layout:
          'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        FirstPageLink: (options) => {
          return (
            <button
              type='button'
              className={options.className}
              onClick={options.onClick}
              disabled={options.disabled}
            >
              <span className='p-3'>{t('organization_paginator_first')}</span>
              <Ripple />
            </button>
          )
        },
        PrevPageLink: prevPageLink,
        NextPageLink: nextPageLink,
        LastPageLink: (options) => {
          return (
            <button
              type='button'
              className={options.className}
              onClick={options.onClick}
              disabled={options.disabled}
            >
              <span className='p-3'>{t('organization_paginator_last')}</span>
              <Ripple />
            </button>
          )
        },
        CurrentPageReport: null,
        JumpToPageInput: null,
        PageLinks: null,
        RowsPerPageDropdown: null,
      }
    }
    case 'sample_lamda': {
      return {
        layout:
          'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
        FirstPageLink: (options) => {
          return (
            <button
              type='button'
              className={options.className}
              onClick={options.onClick}
              disabled={options.disabled}
            >
              <span className='p-2'>{t('organization_paginator_first')}</span>
              <Ripple />
            </button>
          )
        },
        PrevPageLink: prevPageLink,
        PageLinks: pageLinks,
        NextPageLink: nextPageLink,
        LastPageLink: (options) => {
          return (
            <button
              type='button'
              className={options.className}
              onClick={options.onClick}
              disabled={options.disabled}
            >
              <span className='p-2'>{t('organization_paginator_last')}</span>
              <Ripple />
            </button>
          )
        },
        CurrentPageReport: (options) => {
          return (
            <span
              style={{
                userSelect: 'none',
                textAlign: 'center',
                marginLeft: 'auto',
              }}
            >
              {t('organization_paginator_show_report', {
                first: options.first,
                last: options.last,
                totalRecords: options.totalRecords,
              })}
            </span>
          )
        },
        JumpToPageInput: null,
        RowsPerPageDropdown: (options) => {
          const dropdownOptions = [
            {label: 10, value: 10},
            {label: 25, value: 25},
            {label: 50, value: 50},
            {label: 100, value: 100},
          ]

          const onRowTableChange = (e: DropdownChangeParams) => {
            options.onChange(e)
          }

          const handleFocusPageDropDown = () => {
            setIsPageDropDownFocused(true)
          }

          const handleBlurPageDropDown = () => {
            setIsPageDropDownFocused(false)
          }

          return (
            <Dropdown
              ariaLabel='table-page-dropdown'
              value={rowTable}
              options={dropdownOptions}
              onChange={onRowTableChange}
              className={`dropdown-table-input ${
                options.disabled ? 'opacity-md' : ''
              }`}
              disabled={options.disabled}
              onFocus={handleFocusPageDropDown}
              onBlur={handleBlurPageDropDown}
            />
          )
        },
      }
    }

    default:
      return undefined
  }
}

export default TemplatePaginator
