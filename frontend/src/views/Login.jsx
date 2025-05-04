import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) =>{
    e.preventDefault();
    console.log('submit');
  }
  return (
    <FormContainer>
        <h1> Sign In </h1>
        <Form onSubmit={submitHandler}>
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
         <Button type='submit' variant='primary' className='mt-2'>
            Sign In
         </Button>
        </Form>
        <Row className='py-3'>
          <Col>
            New Customer ? <Link to='/register'> Register now </Link>
          </Col>
        </Row>
    </FormContainer>
  )
}

export default Login