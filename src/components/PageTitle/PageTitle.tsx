import React, {FC} from 'react'
import {Col} from 'react-bootstrap'

const PageTitle: FC<{title: string}> = ({title}) => {
  return (
    <Col>
      <div className='page-title-box'>
        <h4 className='page-title'>{title}</h4>
      </div>
    </Col>
  )
}

export default PageTitle
