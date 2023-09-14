import {FC, HTMLAttributes, useContext, useEffect, SetStateAction} from 'react'
import {AccordionContext, useAccordionButton} from 'react-bootstrap'
import {GlobalContext} from '../../store/GlobalContext'
import {AccordionActionType} from '../../store/actions'
import {AccordionName, IUrlParams} from '../../interface'

interface ICustomToggle extends HTMLAttributes<HTMLDivElement> {
  eventKey: string
  containerClass: string
  linkClass: string
  callback?: (eventKey: string) => void
  name: AccordionName
  selectedURLParamsObj?: IUrlParams
  setSelectedURLParamsObj?: (value: SetStateAction<IUrlParams>) => void
}

const CustomToggle: FC<ICustomToggle> = ({
  eventKey,
  containerClass,
  callback,
  style,
  name,
  selectedURLParamsObj,
  setSelectedURLParamsObj
}) => {
  const {state: {accordion}, dispatch: {
    accordion: accordionDispatch
  }} = useContext(GlobalContext)
  const {activeEventKey} = useContext(AccordionContext)
  const isExpand = activeEventKey === eventKey
  
  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  )

  useEffect(() => {
    if (activeEventKey) {
      setSelectedURLParamsObj && setSelectedURLParamsObj({
        ...selectedURLParamsObj,
        collapse: 'filter-accordion',
      })
      accordionDispatch({
        type: AccordionActionType.GET_CURRENT_ACCORDION_INFORMATION,
        payload: {
          ...accordion,
          [name]: activeEventKey
        }
      })
    } else {
      selectedURLParamsObj &&
        setSelectedURLParamsObj && setSelectedURLParamsObj({
          ...selectedURLParamsObj,
          collapse: '0',
        })
      accordionDispatch({
        type: AccordionActionType.GET_CURRENT_ACCORDION_INFORMATION,
        payload: {
          ...accordion,
          [name]: '0'
        }
      })
    }
  }, [activeEventKey])

  return (
    <span className={containerClass} style={style}>
      <span onClick={decoratedOnClick} style={{color: 'var(--ct-body-color)'}}>
        <div className='d-flex align-items-start'>
          {isExpand ? (
            <i
              className='mdi mdi-chevron-down d-none d-sm-inline-block align-middle'
              style={{transform: 'scale(1.5)'}}
            ></i>
          ) : (
            <i
              className='mdi mdi-chevron-right d-none d-sm-inline-block align-middle'
              style={{transform: 'scale(1.5)'}}
            ></i>
          )}
        </div>
      </span>
    </span>
  )
}

export default CustomToggle
