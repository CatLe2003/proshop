import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) =>{
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('Passwords do not match');
    }
    else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <FormContainer>
        <h1> Sign In </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-3'>
            <Form.Label> Name </Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
         </Form.Group>
         <Form.Group controlId='email' className='my-3'>
            <Form.Label> Email Address </Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
         </Form.Group>
         <Form.Group controlId='password' className='my-3'>
            <Form.Label> Password </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
         </Form.Group>
         <Form.Group controlId='confirmPassword' className='my-3'>
            <Form.Label> Confirm Password </Form.Label>
            <Form.Control
              type='password'
              placeholder='Re-enter your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
         </Form.Group>
         <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
            Sign In
         </Button>
         { isLoading && <Loader /> }
        </Form>
        <Row className='py-3'>
          <Col>
            Alreay have an account ? {' '} <Link to={ redirect ? `/login?redirect=${redirect}` : '/login' }> Login </Link>
          </Col>
        </Row>
    </FormContainer>
  )
}

export default Register