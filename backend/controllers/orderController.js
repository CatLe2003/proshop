import asyncHandler from "../middleware/asyncHandler.js"
import Order from '../models/orderModel.js';

//@desc Create new order
// @route POST /api/orders
//@access Private
const addOrderItems = asyncHandler (async (req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order ({
            orderItems: orderItems.map((x) => ({
              ...x,
              product: x._id,
              _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createOrder = await order.save();

        res.status(201).json(createOrder);
    }
})

//@desc Get logged in user orders
// @route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler (async (req,res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
})

//@desc Get order by id
// @route GET /api/orders/:id
//@access Private/Admin
const getOrderById = asyncHandler (async (req,res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
})

//@desc Update order to paid
// @route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler (async (req,res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updateOrder = await order.save();

        res.status(200).json(updateOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

//@desc Update order to deliver
// @route PUT /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDeliver = asyncHandler (async (req,res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(400);
        throw new Error('Order not found');
    }
})

//@desc GET all orders
// @route GET /api/orders/:id/deliver
//@access Private
const getAllOrders = asyncHandler (async (req,res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
})

export {
 addOrderItems,
 getMyOrders,
 getOrderById,
 updateOrderToPaid,
 updateOrderToDeliver,
 getAllOrders
};