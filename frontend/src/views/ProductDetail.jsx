import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap'
import Ratings from '../components/Ratings'

const ProductDetail = () => {
  const { id:productId } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      }
    fetchProduct();
  }, [productId])

  return (
    <>
     <Link className='btn btn-light my-3' to='/'> Go Back </Link>
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
                <ListGroupItem>
                    <Button
                     className='btn-block'
                     type='button'
                     disabled={product.countInStock === 0}
                    >
                        Add To Cart 
                    </Button>
                </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
     </Row>
    </>
  )
}

export default ProductDetail