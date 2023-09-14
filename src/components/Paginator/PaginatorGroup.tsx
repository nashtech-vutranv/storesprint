import {useState, FC, KeyboardEvent, ChangeEvent} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Paginator,
  PaginatorProps,
  PaginatorPageState,
  PaginatorCurrentPageReportOptions,
} from 'primereact/paginator'
import {Button} from 'primereact/button'
import TemplatePaginator from './PaginatorTemplate'

interface IPaginator extends PaginatorProps {}

const PaginateGroup: FC<IPaginator> = () => {
  const {t} = useTranslation()

  const [basicFirst, setBasicFirst] = useState(0)
  const [basicRows, setBasicRows] = useState(10)
  const [customFirst1, setCustomFirst1] = useState(0)
  const [customRows1, setCustomRows1] = useState(10)
  const [customFirst2, setCustomFirst2] = useState(0)
  const [customRows2, setCustomRows2] = useState(10)
  const [customFirst3, setCustomFirst3] = useState(0)
  const [customRows3, setCustomRows3] = useState(10)
  const [contentFirst, setContentFirst] = useState(0)
  const [contentRow, setContentRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInputTooltip, setPageInputTooltip] = useState<string>(
    t('common_tooltip_goto_page')
  )

  const onBasicPageChange = (event: PaginatorPageState) => {
    setBasicFirst(event.first)
    setBasicRows(event.rows)
  }

  const onCustomPageChange1 = (event: PaginatorPageState) => {
    setCustomFirst1(event.first)
    setCustomRows1(event.rows)
    setCurrentPage(event.page + 1)
  }

  const onCustomPageChange2 = (event: PaginatorPageState) => {
    setCustomFirst2(event.first)
    setCustomRows2(event.rows)
  }

  const onCustomPageChange3 = (event: PaginatorPageState) => {
    setCustomFirst3(event.first)
    setCustomRows3(event.rows)
  }

  const onContentPageChange = (event: PaginatorPageState) => {
    setContentFirst(event.first)
    setContentRows(event.rows)
  }

  const onPageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(Number(event.target.value))
  }

  const onPageInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    option: PaginatorCurrentPageReportOptions
  ) => {
    if (event.key === 'Enter' && currentPage) {
      if (currentPage < 0 || currentPage > option.totalPages) {
        setPageInputTooltip &&
          setPageInputTooltip(
            t('common_tooltip_value_limited', {
              totalPages: option.totalPages,
            })
          )
      } else {
        const first = currentPage ? option.rows * (currentPage - 1) : 0
        setCustomFirst1(first)
        setPageInputTooltip &&
          setPageInputTooltip(t('common_tooltip_goto_page'))
      }
    }
  }

  const leftContent = (
    <Button
      type='button'
      icon='pi pi-refresh'
      onClick={() => setContentFirst(0)}
    />
  )
  const rightContent = <Button type='button' icon='pi pi-search' />

  const templateAlpha = TemplatePaginator(
    'sample_alpha',
    currentPage,
    pageInputTooltip,
    onPageInputKeyDown,
    onPageInputChange
  )

  const templateBeta = TemplatePaginator('sample_beta')
  const templateGamma = TemplatePaginator('sample_gamma')

  return (
    <div className='paginator-demo'>
      <div className='card'>
        <h5>Basic</h5>
        <Paginator
          first={basicFirst}
          rows={basicRows}
          totalRecords={120}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onBasicPageChange}
        ></Paginator>
        <br />
        <h5>Custom Template</h5>
        <Paginator
          template={templateAlpha}
          first={customFirst1}
          rows={customRows1}
          totalRecords={120}
          onPageChange={onCustomPageChange1}
        ></Paginator>
        <Paginator
          template={templateBeta}
          first={customFirst2}
          rows={customRows2}
          totalRecords={120}
          onPageChange={onCustomPageChange2}
          className='justify-content-end my-3'
        ></Paginator>
        <Paginator
          template={templateGamma}
          first={customFirst3}
          rows={customRows3}
          totalRecords={120}
          onPageChange={onCustomPageChange3}
          className='justify-content-start my-3'
        ></Paginator>
        <h5>Left and Right Content</h5>
        <Paginator
          first={contentFirst}
          rows={contentRow}
          totalRecords={12}
          onPageChange={onContentPageChange}
          leftContent={leftContent}
          rightContent={rightContent}
          template='FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink'
        ></Paginator>
      </div>
    </div>
  )
}

export default PaginateGroup
