import React from 'react';
import ReactDOM from 'react-dom/client';
//import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './views/Home';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart.jsx';
import Login from './views/Login.jsx';
import Register from './views/Register.jsx';
import Shipping from './views/Shipping.jsx';
import Payment from './views/Payment.jsx';
import PlaceOrder from './views/PlaceOrder.jsx';
import OrderDetail from './views/OrderDetail.jsx';
import Profile from './views/Profile.jsx';
import { Provider } from 'react-redux';
import store from './store.js';
import PrivateRoute from './components/PrivateRoute.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const router =  createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index path='/' element={<Home/>}/>
      <Route path='/product/:id' element={<ProductDetail/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/shipping' element={<Shipping/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/placeorder' element={<PlaceOrder/>}/>
        <Route path='/order/:id' element={<OrderDetail/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store} >
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
