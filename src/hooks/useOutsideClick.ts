import {useEffect, useState} from 'react'

export default function useOutsideClick(ref: any, buttonRef?: any, popoverRef?: any) {
  const [isDialogDisplayed, setIsDialogDisplayed] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

  const checkAttributesByRole = (event: any) => 
    event.target.getAttribute('role') !== 'cell' &&
    event.target.getAttribute('role') !== 'combobox'
  

  const checkAttributesByClass = (event: any) =>
    event.target.getAttribute('class') !== 'linesEllipsis' &&
    event.target.getAttribute('class') !==
      'd-flex justify-content-end align-items-center h-100'

  const checkAttributeContainClass = (event: any) =>
    !event.target.classList.contains('close-icon') &&
    !event.target.classList.contains('tick-icon')

  const checkInputFocusElement = (activeElement: any) => (activeElement &&
          activeElement.tagName.toLowerCase() !== 'input') ||
        (activeElement && activeElement.getAttribute('placeholder') === 'Search')

  const handleClickOutside = (event: any) => {
    if (ref.current && ref.current.table) {
      const activeElement = document.activeElement
      if (
        checkAttributesByRole(event) && 
        checkAttributesByClass(event) && 
        checkAttributeContainClass(event) &&
        checkInputFocusElement(activeElement)
      ) {
        setSelectedRowId(null)
        return
      }
    }

    if (event.target.type === 'checkbox') {
      setIsDialogDisplayed(true)
      return
    }
    if (ref.current && ref.current.nodeName === 'DIV' && ref.current.contains(event.target)) {
        setIsDialogDisplayed(true)
        return
      }

    // if (buttonRef && buttonRef.current && buttonRef.current.contains(event.target)) {
    //   setIsDialogDisplayed(!isDialogDisplayed)
    //   return 
    // }
    if (popoverRef && popoverRef.current && popoverRef.current.contains(event.target)) {
      setIsDialogDisplayed(true)
      return
    }
    else {
      setIsDialogDisplayed(false)
    } 
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [ref, buttonRef])

  return {
    isDialogDisplayed,
    setIsDialogDisplayed,
    selectedRowId,
    setSelectedRowId
  }
}
