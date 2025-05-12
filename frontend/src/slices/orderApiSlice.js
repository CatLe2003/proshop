import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints ({
    endpoints: (builder) => ({
       createOrder: builder.mutation({
        query: (data) => ({
            url: ORDERS_URL,
            method: 'POST',
            body: {...data}
        })
       }),
       getOrderDetail: builder.query({
        query: (orderId) => ({
            url: `${ORDERS_URL}/${orderId}`
        }),
        keepUnusedDataFor: 5
       }),
       payOrder: builder.mutation({
        query: ({ orderId, details }) => ({
            url: `${ORDERS_URL}/${orderId}/pay`,
            method: 'PUT',
            body: {...details}
        })
       }),
       getPayPalClientId: builder.query({
        query: () => ({
            url: PAYPAL_URL
        }),
        keepUnusedDataFor: 5
       }),
       getMyOrders: builder.query({
        query: () => ({
            url: `${ORDERS_URL}/myorders`
        }),
        keepUnusedDataFor: 5
       }),
       getAllOrders: builder.query({
        query: () => ({
            url: `${ORDERS_URL}`
        }),
        keepUnusedDataFor: 5
       }),
       deliverOrder:  builder.mutation({
        query: (orderId) => ({
            url: `${ORDERS_URL}/${orderId}/deliver`,
            method: 'PUT'
        })
       })
    })
})

export const { useCreateOrderMutation, useGetOrderDetailQuery, useGetPayPalClientIdQuery, usePayOrderMutation, useGetMyOrdersQuery, useGetAllOrdersQuery, useDeliverOrderMutation } = orderApiSlice;