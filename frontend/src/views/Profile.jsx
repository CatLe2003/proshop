import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  console.log('order: ', orders)
  useEffect(() => {
   if (userInfo) {
     setName(userInfo.name);
     setEmail(userInfo.email);
   }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        toast.error('Password do not match')
    } else {
        try {
          const res = await updateProfile({
             _id: userInfo._id, 
             name,
             email,
             password
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success('Update profile successfully')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
  }

  return (
    <Row>
        <Col md={3}>
          <h2> User Profile </h2>
          <Form onSubmit={submitHandler}>
            <FormGroup controlId='name' className='my-2'>
                <FormLabel>Name</FormLabel>
                <FormControl 
                  type='name'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup controlId='email' className='my-2'>
                <FormLabel>Email</FormLabel>
                <FormControl 
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            </FormGroup>
            <FormGroup controlId='password' className='my-2'>
                <FormLabel>Password</FormLabel>
                <FormControl 
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </FormGroup>
            <FormGroup controlId='confirmPassword' className='my-2'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl 
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </FormGroup>
            <Button type='submit' variant='primary' className='my-2'>
                Update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
         <h2> My Orders </h2>
         { isLoading ? <Loader/> : error ? (
            <Message variant='danger'>
                { error?.data?.message || error.error }
            </Message>
         ) : (
            <Table striped hover resposive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Delivered</th>
                    </tr>
                </thead>
                <tbody>
                    { orders.map((order) => (
                        <tr key={order._id}> 
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0,10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                                { order.isPaid 
                                  ? (
                                    order.paidAt.substring(0,10)
                                  ) 
                                  : (
                                    <FaTimes style={{ color: 'red' }} />
                                )}
                            </td>
                            <td>
                                { order.isDelivered 
                                  ? (
                                    order.deliveredAt.substring(0,10)
                                  ) 
                                  : (
                                    <FaTimes style={{ color: 'red' }} />
                                )}
                            </td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                  <Button className='btn-sm' variant='light'> Details </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
         )}
        </Col>
    </Row>
  )
}

export default Profile