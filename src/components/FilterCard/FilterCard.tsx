import {FC, ReactNode} from 'react'
import {useTranslation} from 'react-i18next'
import {Container, Card, Accordion} from 'react-bootstrap'
import CustomToggle from '../../components/CustomToggle'
import {AccordionName} from '../../interface/accordion'

const FilterCard: FC<{
  name: AccordionName
  defaultActiveKey?: string
  children: ReactNode
}> = ({children, name, defaultActiveKey}) => {
  const {t} = useTranslation()

  return (
    <>
      <Card>
        <Card.Body style={{border: 'none'}}>
          <Accordion
            defaultActiveKey={defaultActiveKey ?? '0'}
            id='accordion'
            className='custom-accordion'
          >
            <div className='d-flex align-items-center'>
              <CustomToggle
                eventKey='filter-accordion'
                containerClass=''
                style={{marginRight: '0.5rem'}}
                linkClass=''
                name={name}
              />
              <span style={{fontSize: '1.2rem', margin: 0}}>
                {t('products_fitler_title')}
              </span>
            </div>

            <Accordion.Collapse eventKey='filter-accordion'>
              <Container fluid className='px-0'>
                {children}
              </Container>
            </Accordion.Collapse>
          </Accordion>
        </Card.Body>
      </Card>
    </>
  )
}

export default FilterCard
