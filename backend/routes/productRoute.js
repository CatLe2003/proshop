import express from 'express';
import { getProducts, getProductById, createNewProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createNewProduct);
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview);

export default router;