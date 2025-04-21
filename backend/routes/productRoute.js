import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();


//@desc Fetch all products
// @route GET api/products
//@access Public
router.route('/').get(getProducts);


//@desc Fetch product by ID
// @route GET api/products/:id
//@access Public

router.route('/:id').get(getProductById);

export default router;