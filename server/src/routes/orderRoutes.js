import express from 'express';
import * as OrderController from '../controllers/orderController.js';
import { uploadPhotos } from '../middleware/upload.js';

const router = express.Router();

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', uploadPhotos, OrderController.createOrder);
router.delete('/:id', OrderController.deleteOrderById);
router.put('/:id', OrderController.updateOrder);

export default router;
