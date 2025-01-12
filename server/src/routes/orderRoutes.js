import express from 'express';
import * as OrderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.delete('/:id', OrderController.deleteOrderById);
router.put('/:id', OrderController.updateOrder);

export default router;
