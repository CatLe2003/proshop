import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/userApiSlice';
import { Form, FormGroup, Button } from 'react-bootstrap';

const UserEdit = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        _id: userId,
        name,
        email,
        isAdmin
      }
      await updateUser(updatedUser);
      console.log(JSON.stringify(updatedUser, null, 2));
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/user-list');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <Link to='/admin/user-list' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1> Edit User </h1> 
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
                      placeholder='Enter user name'
                      onChange={(e) => setName(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={email}
                      placeholder='Enter user email'
                      onChange={(e) => setEmail(e.target.value)}
                    >

                    </Form.Control>
                </FormGroup>
                <FormGroup controlId='isAdmin' className='my-2'>
                    <Form.Check
                      type='checkbox'
                      label='Is Admin'
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    >

                    </Form.Check>
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

export default UserEdit