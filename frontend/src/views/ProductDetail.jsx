import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Form, Row, Col, Image, ListGroup, Card, Button, ListGroupItem, FormGroup } from 'react-bootstrap'
import Ratings from '../components/Ratings'
import { useGetProductDetailsQuery, useCreateReviewsMutation } from '../slices/productApiSlice'
import { Loader } from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id: productId } = useParams();
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewsMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  
  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart');
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap()
      
      refetch();
      toast.success('Review submitted');
      setRating(0);
      setComment('');

    } catch (error) {
      toast.error(error?.data.message || error.error);
    }
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
       <Row className='review'>
         <Col md={6}>
           <h2>Reviews</h2>
           { product.reviews.length === 0 && (<Message>No Reviews</Message>) }
           <ListGroup variant='flush'>
            { product.reviews.map((review) => (
              <ListGroupItem key={review._id}>
                <strong>{ review.name }</strong>
                <Ratings value={review.rating} />
                <p>{review.createdAt.substring(0,10)}</p>
                <p>{review.comment}</p>
              </ListGroupItem>
            ))}
             <ListGroupItem>
              <h2> Write your review </h2>
              { loadingReview && <Loader /> }
              { userInfo  ? (
                <Form onSubmit={submitHandler}>
                  <FormGroup controlId='rating' className='my-2'>
                   <Form.Label>Rating</Form.Label>
                   <Form.Control
                     as='select'
                     value={rating}
                     onChange={(e) => setRating(Number(e.target.value))}
                   >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                   </Form.Control> 
                  </FormGroup>
                  <FormGroup controlId='comment' className='my-2'>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      row='3'
                      value={comment}
                      onChange={(e) =>setComment(e.target.value)}
                      ></Form.Control>
                  </FormGroup>
                  <Button 
                    disabled={loadingReview}
                    type='submit'
                    variant='primary'
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to='/login'> Sign In </Link> to write a review {' '}
                </Message>
              )}
             </ListGroupItem>
           </ListGroup>
         </Col>
       </Row>
      </>
     )}
    </>
  )
}

export default ProductDetail