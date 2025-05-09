import express from 'express';
import { getProducts, getProductById, createNewProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createNewProduct);;
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;