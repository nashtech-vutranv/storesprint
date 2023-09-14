import {useState, KeyboardEvent, ChangeEvent} from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import {
  Paginator,
  PaginatorPageState,
  PaginatorCurrentPageReportOptions,
} from 'primereact/paginator'
import TemplatePaginator from '../Paginator/PaginatorTemplate'

export default {
  title: 'UI/Paginator',
  component: Paginator,
} as ComponentMeta<typeof Paginator>

const TemplateBasic: ComponentStory<typeof Paginator> = (args) => {
  const [customFirst, setCustomFirst] = useState(0)
  const [customRows, setCustomRows] = useState(10)

  const onPageChange = (event: PaginatorPageState) => {
    setCustomFirst(event.first)
    setCustomRows(event.rows)
  }

  return (
    <Paginator
      {...args}
      first={customFirst}
      rows={customRows}
      onPageChange={onPageChange}
    />
  )
}

const TemplateAlpha: ComponentStory<typeof Paginator> = (args) => {
  const [customFirst, setCustomFirst] = useState(0)
  const [customRows, setCustomRows] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInputTooltip, setPageInputTooltip] = useState(
    'Press "Enter" key to go to this page.'
  )

  const onPageChange = (event: PaginatorPageState) => {
    setCustomFirst(event.first)
    setCustomRows(event.rows)
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
            `Value must be between 1 and ${option.totalPages}.`
          )
      } else {
        const first = currentPage ? option.rows * (currentPage - 1) : 0
        setCustomFirst(first)
        setPageInputTooltip &&
          setPageInputTooltip('Press "Enter" key to go to this page.')
      }
    }
  }

  const template = TemplatePaginator(
    'sample_alpha',
    currentPage,
    pageInputTooltip,
    onPageInputKeyDown,
    onPageInputChange
  )

  return (
    <Paginator
      {...args}
      first={customFirst}
      rows={customRows}
      template={template}
      onPageChange={onPageChange}
    />
  )
}

const TemplateBeta: ComponentStory<typeof Paginator> = (args) => {
  const [customFirst, setCustomFirst] = useState(0)
  const [customRows, setCustomRows] = useState(10)

  const onPageChange = (event: PaginatorPageState) => {
    setCustomFirst(event.first)
    setCustomRows(event.rows)
  }

  const template = TemplatePaginator('sample_beta')

  return (
    <Paginator
      {...args}
      first={customFirst}
      rows={customRows}
      template={template}
      onPageChange={onPageChange}
    />
  )
}

const TemplateGamma: ComponentStory<typeof Paginator> = (args) => {
  const [customFirst, setCustomFirst] = useState(0)
  const [customRows, setCustomRows] = useState(10)

  const onPageChange = (event: PaginatorPageState) => {
    setCustomFirst(event.first)
    setCustomRows(event.rows)
  }

  const template = TemplatePaginator('sample_gamma')

  return (
    <Paginator
      {...args}
      first={customFirst}
      rows={customRows}
      template={template}
      onPageChange={onPageChange}
    />
  )
}

export const Basic = TemplateBasic.bind({})
Basic.args = {
  totalRecords: 120,
  rowsPerPageOptions: [10, 20, 30],
}

export const Alpha = TemplateAlpha.bind({})
Alpha.args = {
  totalRecords: 120,
}

export const Beta = TemplateBeta.bind({})
Beta.args = {
  totalRecords: 120,
}

export const Gamma = TemplateGamma.bind({})
Gamma.args = {
  totalRecords: 120,
}
