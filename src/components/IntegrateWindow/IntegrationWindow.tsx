import {FC} from 'react'
import NewWindow, {INewWindowProps} from 'react-new-window'

export const IntegrationWindow: FC<INewWindowProps> = (props) => {
  return (
    <NewWindow {...props}>
      {props.children}
    </NewWindow>
  )
}
