import {forwardRef, useEffect, useRef} from 'react'

type IndeterminateCheckboxProps = {
    indeterminate: any
    children?: React.ReactNode
    onChange?: (e: any) => void
    id: string
}

const IndeterminateCheckbox = forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
    ({indeterminate, onChange, id, ...rest}, ref) => {
        const defaultRef = useRef()
        const resolvedRef: any = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <div className="form-check">
                <input type="checkbox" className="form-check-input" ref={resolvedRef} {...rest} onChange={onChange} id={id}/>
                <label htmlFor="form-check-input" className="form-check-label"></label>
            </div>
        )
    }
)

export default IndeterminateCheckbox