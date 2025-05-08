import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if(!shippingAddress.address) {
        navigate('/shipping');
    } else if (!paymentMethod) {
        navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
        console.log('cart', cart);
        
        const res = await createOrder({
            orderItems: cart.cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
    } catch (error) {
        toast.error(error?.data?.message || error.error);
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
                <h2> Order Items </h2>
                { cart.cartItems.length === 0 
                    ? (
                        <Message> Your cart is empty </Message>
                    ) : (
                        <ListGroup variant='flush'>
                            { cart.cartItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                      <Col md={1}>
                                        <Image 
                                            src={item.image} 
                                            alt={item.name}
                                            fluid
                                            rounded
                                        />
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
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                }
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col md={6}>
                        <h2>Shipping</h2>
                        <p>
                            <strong> Address </strong>
                            { shippingAddress.address } , { shippingAddress.city }, { shippingAddress.postalCode } , { shippingAddress.country }
                        </p>
                    </Col>
                    <Col md={6}>
                        <h2> Payment Method </h2>
                        <p>
                            <strong> Method: </strong>
                            { paymentMethod }
                        </p>
                    </Col>
                </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
         <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2> Order Summary </h2>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Item: </Col>
                        <Col> $ {cart.itemsPrice} </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Shipping Price: </Col>
                        <Col> $ {cart.shippingPrice} </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Tax: </Col>
                        <Col> $ {cart.taxPrice} </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Total: </Col>
                        <Col> $ {cart.totalPrice} </Col>
                    </Row>
                </ListGroup.Item>
                { error && 
                   <ListGroup.Item>
                      <Message variant='danger'>  { error.data?.message || error.error } </Message>
                   </ListGroup.Item>
                }
                <ListGroup.Item>
                    <Button 
                      type='button'
                      className='btn-block'
                      disabled={cart.cartItems.length === 0}
                      onClick={placeOrderHandler}
                    >
                        Place Order
                    </Button>
                    { isLoading && <Loader />}
                </ListGroup.Item>
            </ListGroup>
         </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrder