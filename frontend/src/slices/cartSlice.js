import { createSlice } from '@reduxjs/toolkit'
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart') 
? JSON.parse(localStorage.getItem('cart')) 
: {cartItems: []};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((product) =>  product._id === item._id);

            if(existItem) {
                state.cartItems = state.cartItems.map((product) => product._id === existItem._id ? item : product)
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            updateCart(state);
        },
        removeFormCart: (state, action) => {
            state.cartItems = state.cartItems.filter((product) => product._id !== action.payload);

            return updateCart(state);
        }
    }
})

export const { addToCart, removeFormCart } = cartSlice.actions;
export default cartSlice.reducer;