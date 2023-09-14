import {FC, useState, useRef, useEffect} from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

interface IFieldTextDataTable {
  value: string | undefined
  placement: 'top' | 'bottom' | 'right' | 'left'
  align?: 'right' | 'left' | 'center'
}

const FieldTextDataTable: FC<IFieldTextDataTable> = (props) => {
  const ref = useRef<any>()
  const {value, placement, align = 'left'} = props
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState<boolean>(false)

  const linesEllipsis = (
    <div className='linesEllipsis' ref={ref} style={{textAlign: align}}>
      {value}
    </div>
  )

  const renderTooltip = (overlayProps: any) => {
    return (
      <Tooltip id={`tooltip-${value}`} {...overlayProps} style={{...overlayProps.style, position: 'absolute'}}>
        {value}
      </Tooltip>
    )
  }

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.offsetWidth < ref.current.scrollWidth
        ? setIsTooltipDisplayed(true)
        : setIsTooltipDisplayed(false)
    }
  }, [ref])

  return isTooltipDisplayed ? (
    <OverlayTrigger
      key={value}
      placement={placement}
      overlay={renderTooltip}
    >
      {linesEllipsis}
    </OverlayTrigger>
  ) : (
    linesEllipsis
  )
}

export default FieldTextDataTable
