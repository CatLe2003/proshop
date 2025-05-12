import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/userApiSlice';

const UserList = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  const [ deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const createNewUser = async () => {

  }

  const deleteHandler = async (userId) => {
    if (window.confirm ('Please confirm to delete user')){
      try {
        await deleteUser(userId);
        refetch();
        toast.success(`Delete user #${userId} successfully`)
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Users</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createNewUser}>
            <MdOutlineAddCircleOutline /> Create User
          </Button>
        </Col>
      </Row>
      { loadingDelete && <Loader/> }
      { isLoading ? <Loader/> 
          : error ? <Message variant='danger'>{ error }</Message>
          :(
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                { users.map((user) => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td><a href={`mailto:${user.email}`}>{ user.email }</a></td>
                        <td>
                        {user.isAdmin ? (
                          <FaCheck style={{ color: 'green' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                        </td>
                        <td>
                          <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant='light' className='btn-sm m-2'>
                                <FaEdit /> Edit
                            </Button>
                          </LinkContainer>
                          <Button 
                            variant='danger' 
                            onClick={() => deleteHandler(user._id)}
                            className='btn-sm text-white'
                          >
                              <FaTrash style={{ color: 'white' }} /> Delete
                          </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
      )}
    </>
  )
}

export default UserList;