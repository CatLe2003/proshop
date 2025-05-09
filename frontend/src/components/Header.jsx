import React from 'react'
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/logo.png'
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout }  from '../slices/authSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutAPICall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
        await logoutAPICall().unwrap();
        dispatch(logout());
        navigate('/login')
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>
                    <img src={logo} alt='ProShop'/>
                        ProShop
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto' >
                        <LinkContainer to='/cart'>
                            <Nav.Link><FaShoppingCart/> 
                             Cart 
                             { cartItems.length > 0 && (
                                    <Badge pill bg='success' style={{ marginLeft: '5px'}}>
                                        { cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </Badge>
                                )
                             }
                            </Nav.Link>
                        </LinkContainer>
                        { userInfo 
                          ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                  <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler} style={{ marginLeft: '5px'}}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                          ) 
                          : (
                            <LinkContainer to='/login'>
                                <Nav.Link><FaUser/> Login </Nav.Link>
                            </LinkContainer>
                        )}
                        { userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/order-list'>
                                    <NavDropdown.Item> Order List </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/user-list'>
                                    <NavDropdown.Item> User List </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/product-list'>
                                    <NavDropdown.Item> Product List </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header