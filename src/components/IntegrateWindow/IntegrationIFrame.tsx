import Iframe from 'react-iframe'
import {IIframe} from 'react-iframe/types'

export default function IntegrationIFrame(props: IIframe) {
  return <Iframe {...props} />
}