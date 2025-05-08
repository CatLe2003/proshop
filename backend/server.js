import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT;
connectDB();
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);

app.get('/api/config/paypal', (req,res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))
app.use(notFound);
app.use(errorHandler);
app.listen(port, ()=> console.log(`Server running on port ${port}`))