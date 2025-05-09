import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetProductsQuery } from '../../slices/productApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { MdOutlineAddCircleOutline } from "react-icons/md";

const ProductList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  const deleteHandler = (productId) => {

  }
  return (
    <>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3'>
            <MdOutlineAddCircleOutline /> Create Product
          </Button>
        </Col>
      </Row>
      { isLoading ? <Loader/> 
          : error ? <Message variant='danger'>{ error }</Message>
          :(
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                { products.map((product) => (
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                          <LinkContainer to={`/admin/product/${product._id}`}>
                            <Button variant='light' className='btn-sm m-2'>
                                <FaEdit /> Edit
                            </Button>
                          </LinkContainer>
                          <LinkContainer to={`/admin/product/${product._id}`}>
                            <Button 
                              variant='danger' 
                              onClick={() => deleteHandler(product._id)}
                              className='btn-sm text-white'
                            >
                                <FaTrash style={{ color: 'white' }} /> Delete
                            </Button>
                          </LinkContainer>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
      )}
    </>
  )
}

export default ProductList;