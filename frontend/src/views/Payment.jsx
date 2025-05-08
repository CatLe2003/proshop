import { useState, useEffect } from 'react'
import { Form, Button, Col, FormGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    console.log(shippingAddress);

    if(!shippingAddress){
        navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <FormGroup>
                <Form.Label as='legend'> Select Method </Form.Label>
                <Col>
                 <Form.Check
                   type='radio'
                   className='my-2'
                   label='PayPal or Credit Card'
                   id='PayPal'
                   name='paymentMethod'
                   value='PayPal'
                   checked
                   onChange={(e) =>  setPaymentMethod(e.target.value)}
                 />
                 <Button type='submit' variant='primary'>
                    Continue
                 </Button>
                </Col>
            </FormGroup>
        </Form>
    </FormContainer>
  )
}

export default Payment