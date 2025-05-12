import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productApiSlice';
import { Form, FormGroup, Button } from 'react-bootstrap';

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState(0);

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [updateProductImage, { isLoading: loadingUpdateImage }] = useUploadProductImageMutation();


  const navigate = useNavigate();

  useEffect(() => {
    if(product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setDescription(product.description);
      setCategory(product.category);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedProduct = {
        _id: productId,
        name,
        price,
        category,
        brand,
        countInStock,
        description,
        image
    };
    
    console.log(JSON.stringify(updatedProduct, null, 2));
    const res = await updateProduct(updatedProduct);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Product update successfully');
      navigate('/admin/product-list');
    }

  }

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await updateProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  return (
    <>
      <Link to='/admin/product-list' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1> Edit Product </h1> 
        { loadingUpdate && <Loader/> }

        { isLoading ? <Loader/> 
            : error ? <Message variant='danger'> { error } </Message>
            : (
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={name}
                      placeholder='Enter product name'
                      onChange={(e) => setName(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='price'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type='number'
                      value={price}
                      placeholder='Enter product price'
                      onChange={(e) => setPrice(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='image'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type='text'
                      value={image}
                      placeholder='Enter image url'
                      onChange={(e) => setImage(e.target.value)}
                    >
                    </Form.Control>
                    <Form.Control
                      type='file'
                      label='Choose product image'
                      onChange={uploadFileHandler}
                    >
                    </Form.Control>
                </FormGroup>

                <FormGroup controlId='brand'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type='text'
                      value={brand}
                      placeholder='Enter product brand'
                      onChange={(e) => setBrand(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type='text'
                      value={category}
                      placeholder='Enter product category'
                      onChange={(e) => setCategory(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='countInStock'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                      type='number'
                      value={countInStock}
                      placeholder='Enter product count in stock'
                      onChange={(e) => setCountInStock(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type='text'
                      value={description}
                      placeholder='Enter product description'
                      onChange={(e) => setDescription(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <Button type='submit' variant='primary' className='my-2'>
                    Update
                </Button>
            </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEdit