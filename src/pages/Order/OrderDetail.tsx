import {useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import queryString from 'query-string'
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom'
import {InputText} from 'primereact/inputtext'
import {Card, Col, Container, Row, Tab, Nav, Button} from 'react-bootstrap'
import {useHandleError, usePreviousPage} from '../../hooks'
import SeoConfig from '../../components/SEO/SEO-Component'
import {seoProperty} from '../../constants/seo-url'
import {IOrderDetail} from '../../interface'
import {GlobalContext} from '../../store/GlobalContext'
import OrderServices from '../../services/OrderService'
import {OrderlineTable, ShipmentTable} from '../../components/Order'
import {formatDate} from '../../utils'
import {ROUTE_DELIVERY_TYPE_MAPPINGS, ROUTE_ORDER} from '../../constants'
import {PagesInfoActionType} from '../../store/actions'
import './OrderDetail.scss'

interface ITabItem {
  label: string
  key: string
}

const tabItems: ITabItem[] = [
  {
    key: 'order_detail_tab_orderlines',
    label: 'order_detail_tab_orderlines',
  },
  {
    key: 'order_detail_tab_shipments',
    label: 'order_detail_tab_shipments',
  },
]

export default function OrderDetail() {
  const {orderId} = useParams<{orderId: string}>()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as any

  const [orderDetail, setOrderDetail] = useState<IOrderDetail>({
    aggregatorOrderReference: '',
    createdAt: '',
    currency: '',
    ecommerceModifiedAt: '',
    erpId: '',
    id: '',
    marketplacePurchaseDate: '',
    marketplaceOrderNumber: '',
    modifiedAt: '',
    orderStatus: '',
    orderType: '',
    shippingCost: '',
    version: 0,
    orderCreatedAt: '',
    totalAmount: '',
    deliveryAddress: {
      addressLine1: '',
      id: '',
      createdAt: '',
      modifiedAt: '',
      version: 0,
      postCode: '',
      countryCode: '',
    },
    orderLines: [],
    marketplace: {
      channelId: '',
      currencyId: '',
      erpId: '',
      name: '',
      id: '',
      marketplaceType: '',
      marketplaceTypeId: '',
    },
  })

  const {
    state: {axiosClient, previousPage},
    dispatch: {pagesInfo: pagesInfoDispatch},
  } = useContext(GlobalContext)

  const {handleErrorResponse} = useHandleError()

  const getOrderById = () => {
    new OrderServices(axiosClient)
      .getOrderById(`${orderId}`)
      .then((response: any) => {
        setOrderDetail({
          ...response.data,
        })
      })
      .catch((err: any) => {
        handleErrorResponse(err)
      })
  }

  const handleGoBackToOrderList = () => {
    if (!location.state) {
      navigate(ROUTE_ORDER.ROOT)
      return
    }
    if (previousPage && previousPage.name === 'apps-orders' && location.state && location.state.prevUrl) {
      navigate(location.state.prevUrl, {
        state: location.state,
      })
    } else navigate(-1)
  }

  const handleNavigateToDeliveryPage = () => {
    pagesInfoDispatch({
      type: PagesInfoActionType.GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA,
      payload: {
        selectedMarketplaceType: {
          value: orderDetail.marketplace.marketplaceTypeId,
          label: orderDetail.marketplace.marketplaceType,
        },
      },
    })
    navigate(
      `${ROUTE_DELIVERY_TYPE_MAPPINGS.ROOT}?${queryString.stringify({
        currentStatus: 'apply',
        marketplaceTypeLabel: orderDetail.marketplace.marketplaceType,
        marketplaceTypeValue: orderDetail.marketplace.marketplaceTypeId,
      })}`
    )
  }

  useEffect(() => {
    if (orderId) {
      getOrderById()
    }
  }, [orderId])

  usePreviousPage('apps-order-detail', {orderId})

  return (
    <>
      <SeoConfig seoProperty={seoProperty.orderDetail}></SeoConfig>
      <Card className='card-form mt-3'>
        <Card.Header>
          <h4 className='card-form__title'>{t('order_detail_title')}</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Container fluid>
              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='id'>{t('order_detail_id')}</label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='id'
                    name='id'
                    value={orderDetail.id}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='erpId'>{t('order_detail_erpId')}</label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='erpId'
                    name='erpId'
                    value={orderDetail.erpId}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='marketplaceOrderNumber'>
                    {t('order_detail_marketplace_order_number')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='marketplaceOrderNumber'
                    name='marketplaceOrderNumber'
                    value={orderDetail.marketplaceOrderNumber}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='createdAt'>
                    {t('order_detail_createdAt')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='createdAt'
                    name='createdAt'
                    value={formatDate(orderDetail.createdAt)}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='countryCode'>
                    {t('order_detail_country_code')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='countryCode'
                    name='countryCode'
                    value={orderDetail.deliveryAddress.countryCode}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='totalAmount'>
                    {t('order_detail_total_amount')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='totalAmount'
                    name='totalAmount'
                    value={
                      orderDetail.totalAmount === 'null'
                        ? ''
                        : orderDetail.totalAmount
                    }
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='currency'>{t('order_detail_currency')}</label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='currency'
                    name='currency'
                    value={orderDetail.currency}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='marketplaceDeliveryService'>
                    {t('order_detail_marketplace_delivery_service')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <div className='marketplace-delivery-service__wrapper'>
                    <InputText
                      id='marketplaceDeliveryService'
                      name='marketplaceDeliveryService'
                      value={
                        orderDetail.orderLines[0]?.marketplaceDeliveryService ||
                        ''
                      }
                      className='w-full p-1'
                      disabled
                    />
                    {!orderDetail.orderLines[0]?.deliveryType && (
                      <span className='marketplace-delivery-service__warning'>
                        <i className='uil-exclamation-triangle marketplace-delivery-service__prefix-icon'></i>
                        <span>
                          {t(
                            'order_detail_marketplace_delivery_service_warning'
                          )}
                        </span>
                        <i
                          className='uil-external-link-alt marketplace-delivery-service__suffix-icon'
                          onClick={handleNavigateToDeliveryPage}
                        ></i>
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='shippingCost'>
                    {t('order_detail_delivery_cost')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='shippingCost'
                    name='shippingCost'
                    value={orderDetail.shippingCost}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='align-items-center py-1'>
                <Col xs={4}>
                  <label htmlFor='orderStatus'>
                    {t('order_detail_order_status')}
                  </label>
                </Col>
                <Col xs={8} className='p-fluid'>
                  <InputText
                    id='orderStatus'
                    name='orderStatus'
                    value={orderDetail.orderStatus}
                    className='w-full p-1'
                    disabled
                  />
                </Col>
              </Row>

              <Row className='mt-4'>
                <Container fluid>
                  <Tab.Container defaultActiveKey='order_detail_tab_orderlines'>
                    <Nav variant='pills' justify className='bg-nav-pills'>
                      {tabItems.map((x) => (
                        <Nav.Item key={x.key}>
                          <Nav.Link as={Link} to='#' eventKey={x.key}>
                            <i className='d-md-none d-block me-1'></i>
                            <span className='d-none d-md-block'>
                              {t(x.label)}
                            </span>
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane
                        eventKey='order_detail_tab_orderlines'
                        id='order_detail_tab_orderlines'
                      >
                        <Row>
                          <Col sm='12'>
                            <OrderlineTable
                              orderId={orderId}
                              getOrderDetail={getOrderById}
                            />
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane
                        eventKey='order_detail_tab_shipments'
                        id='order_detail_tab_shipments'
                      >
                        <Row>
                          <Col sm='12'>
                            <ShipmentTable orderId={orderId} />
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane
                        eventKey='order_detail_tab_status_history'
                        id='order_detail_tab_status_history'
                      >
                        Status history
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Container>
              </Row>

              <Row className='mt-2'>
                <Col>
                  <div className='d-flex justify-content-center'>
                    <Button className='me-2' onClick={handleGoBackToOrderList}>
                      {t('common_confirm_close')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}
