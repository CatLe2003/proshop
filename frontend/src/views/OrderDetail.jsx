import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Card, Image, ListGroupItem } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailQuery, useGetPayPalClientIdQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/orderApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const OrderDetail = () => {
  const { id: orderId } = useParams();

  const { 
    data: order, 
    refetch, 
    isLoading, 
    error 
  } = useGetOrderDetailQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: isLoadingDeliver }] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { 
    data: paypal, 
    isLoading: loadingPaypal, 
    error: paypalError 
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!paypalError && !loadingPaypal && paypal.clientId) {
     const loadPayPalScript = async () => {
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': paypal.clientId,
          currency: 'USD'
        }
      });
      paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
     }

     if (order && !order.isPaid && !window.paypal) {
      loadPayPalScript();
     }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, paypalError]);

  function onApprove (data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment successful');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    })
  }
  // async function onApproveTest (details) {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success('Payment successful');
  // }
  function onError (error) {
    toast.error(error.message)
  }
  function createOrder (data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice
          }
        }
      ]
    }).then((orderId) => orderId);
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return (
    isLoading ? <Loader/> : 
    error     ? <Message variant='danger'> { error } </Message>
    : (
    <>
     <h1>Order {order._id} </h1>
     <Row>
      <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroupItem>
            <h2> Order Items </h2>
            { order.orderItems.map((item, index) => (
              <ListGroupItem key={index}>
                <Row>
                  <Col md={1}>
                    <Image src={item.image} alt={item.name} fluid rounded/>
                  </Col>
                  <Col>
                    <Link to={`/product/${item.product}`}>
                        {item.name}
                    </Link>
                  </Col>
                  <Col md={4}>
                    { item.qty } x $ { item.price } = $ { item.qty * item.price }
                  </Col>
                </Row>
              </ListGroupItem>
            ))
            }
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              <h2>Shipping</h2>
              <p>
                <strong> Name: </strong> { order.user.name }
              </p>
              <p>
                <strong> Email: </strong> { order.user.email }
              </p>
              <p>
                <strong> Address: </strong> 
                { order.shippingAddress.address }, { order.shippingAddress.city } {' '}, { order.shippingAddress.country }
              </p>
              { order.isDelivered 
                ? (
                  <Message variant='success'>
                    Delivered on {order.deliveredAt}
                  </Message>
                ) 
                : (
                  <Message variant='info'>
                    In delivering ...
                  </Message>
                )
              }
            </Row>
            <Row>
              <h2> Payment Method </h2>
              <p>
                <strong> Method: </strong> 
                { order.paymentMethod }
              </p>
              { order.isPaid 
                ? (
                  <Message variant='success'>
                    Paid on {order.paidAt}
                  </Message>
                ) 
                : (
                  <Message variant='info'>
                    Not paid
                  </Message>
                )
              }
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>
                  Item Total: 
                  </Col>
                  <Col>
                  { order.itemsPrice }
                  </Col>
                </Row>
                <Row>
                  <Col>
                  Shipping Fee: 
                  </Col>
                  <Col>
                  { order.shippingPrice }
                  </Col>
                </Row>
                <Row>
                  <Col>
                  Tax: 
                  </Col>
                  <Col>
                  { order.taxPrice }
                  </Col>
                </Row>
                <Row>
                  <Col>
                  Total: 
                  </Col>
                  <Col>
                  { order.totalPrice }
                  </Col>
                </Row>
              </ListGroupItem>
              { !order.isPaid && (
                <ListGroupItem>
                  { loadingPay && <Loader/> }

                  { isPending ? <Loader/> : ( 
                    <div>
                     {/* <Button 
                       onClick={onApproveTest} 
                       style={{ marginBottom: '10px' }}
                      > 
                        Test Pay Order 
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroupItem>
              )}
              { isLoadingDeliver && <Loader /> }
              { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroupItem>
                  <Button 
                    type='button' 
                    onClick={deliverOrderHandler}
                    className='btn btn-block'
                  >
                    Mark As Delivered
                  </Button>
                </ListGroupItem>
              )}
          </ListGroup>
        </Card>
      </Col>
     </Row>
    </>
    )
  )
}

export default OrderDetail