import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Form, Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap'
import Ratings from '../components/Ratings'
import { useGetProductDetailsQuery } from '../slices/productApiSlice'
import { Loader } from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';
const ProductDetail = () => {
  const { id: productId } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart');
  }
  return (
    <>
     <Link className='btn btn-light my-3' to='/'> Go Back </Link>
     { isLoading ? (
       <Loader/>
     ) : error ? (
      <Message variant='danger'>{error?.data?.message || error.error}</Message>
     ) : (
       <>
       <Row>
          <Col md={5}>
           <Image src={product.image} alt={product.name} fluid/>
          </Col>
          <Col md={4}>
           <ListGroup variant='flush'>
              <ListGroupItem>
                  <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`}/>
              </ListGroupItem>
              <ListGroupItem>
                  Price: ${product.price}
              </ListGroupItem>
           </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                  <ListGroupItem>
                      <Row>
                          <Col>Price: </Col>
                          <Col>
                           <strong>${product.price}</strong>
                          </Col>
                      </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                      <Row>
                          <Col>Status: </Col>
                          <Col>
                           <strong>{product.countInStock > 0 ? 'In stock' : 'Out of stock'}</strong>
                          </Col>
                      </Row>
                  </ListGroupItem>
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                         <Form.Control 
                           as='select'
                           value={qty}
                           onChange={(e) => setQty(Number(e.target.value))}
                         >
                          {[...Array(product.countInStock).keys()].map((product) => (
                            <option key= {product + 1} value={product + 1}>
                              {product + 1}
                            </option>
                          ))}
                         </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem>
                      <Button
                       className='btn-block'
                       type='button'
                       disabled={product.countInStock === 0}
                       onClick={addToCartHandler}
                      >
                          Add To Cart 
                      </Button>
                  </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
       </Row>
      </>
     )}
    </>
  )
}

export default ProductDetail