import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetProductsQuery, useCreateNewProductMutation, useDeleteProductMutation } from '../../slices/productApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Paging from '../../components/Pagination';

const UserList = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

  const [createNewProduct, { isLoading: loadingCreate }] = useCreateNewProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const createProductHandler = async () => {
    try {
        await createNewProduct();
        refetch();
        toast.success('Create new product successfully');
    } catch (error) {
        toast.error (error?.data?.message || error.error);
    }
  }
  const deleteHandler = async (productId) => {
    if (window.confirm ('Please confirm to delete the product')){
      try {
        await deleteProduct(productId);
        refetch();
        toast.success(`Delete product #${productId} successfully`)
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler} disabled={loadingCreate}>
            <MdOutlineAddCircleOutline /> Create Product
          </Button>
        </Col>
      </Row>
      { loadingDelete && <Loader /> }
      { isLoading ? <Loader/> 
          : error ? <Message variant='danger'>{ error }</Message>
          :(
        <>
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
                  { data.products.map((product) => (
                      <tr key={product._id}>
                          <td>{product._id}</td>
                          <td>{product.name}</td>
                          <td>${product.price}</td>
                          <td>{product.category}</td>
                          <td>{product.brand}</td>
                          <td>
                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                              <Button variant='light' className='btn-sm m-2'>
                                  <FaEdit /> Edit
                              </Button>
                            </LinkContainer>
                            <Button 
                              variant='danger' 
                              onClick={() => deleteHandler(product._id)}
                              className='btn-sm text-white'
                            >
                                <FaTrash style={{ color: 'white' }} /> Delete
                            </Button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </Table>
          <Paging 
            pages={data.pages}
            page={data.page}
          />
        </>
      )}
    </>
  )
}

export default UserList;