import express from 'express';
import { getProducts, getProductById, createNewProduct } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createNewProduct);;
router.route('/:id').get(getProductById);

export default router;