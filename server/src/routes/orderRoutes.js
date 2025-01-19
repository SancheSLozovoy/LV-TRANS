import express from 'express';
import * as OrderController from '../controllers/orderController.js';
import { uploadPhotos } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Gets
 *     summary: Получение всех заказов
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   info:
 *                     type: string
 *                     example: Some info
 *                   weight:
 *                     type: integer
 *                     example: 1500
 *                   from:
 *                     type: string
 *                     example: Rostov-on-Don
 *                   to:
 *                     type: string
 *                     example: Orel
 *                   create_at:
 *                      type: date
 *                      example: 2025-12-12
 *                   date_start:
 *                     type: string
 *                     format: date
 *                     example: 2026-04-01
 *                   date_end:
 *                     type: string
 *                     format: date
 *                     example: 2026-05-03
 *                   status_id:
 *                      type: integer
 *                      example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 3
 *       500:
 *         description: Error getting orders
 *       404:
 *         description: No orders found
 */

/**
 * @swagger
 * /orders/{id}:
 *  get:
 *     tags:
 *       - Gets
 *     summary: Получение заказа
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 20
 *                 info:
 *                   type: string
 *                   example: Info
 *                 weight:
 *                   type: number
 *                   example: 5000
 *                 from:
 *                   type: string
 *                   example: From
 *                 to:
 *                   type: string
 *                   example: To
 *                 create_at:
 *                   type: string
 *                   format: date
 *                   example: 2025-10-10
 *                 date_start:
 *                   type: string
 *                   format: date
 *                   example: 2025-12-12
 *                 date_end:
 *                   type: string
 *                   format: date
 *                   example: 2025-12-12
 *                 status_id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Error getting orders
 *       404:
 *         description: Order not found
 *       400:
 *         description: Invalid order ID
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *     - Posts
 *     summary: Создание заказа
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               info:
 *                 type: string
 *               weight:
 *                 type: number
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               date_start:
 *                 type: string
 *                 format: date
 *               date_end:
 *                 type: string
 *                 format: date
 *               user_id:
 *                 type: integer
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Order created and photos uploaded
 *       400:
 *         description: Missing required fields Or No photos uploaded
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags:
 *     - Delete
 *     summary: Удаление заказа
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 *       400:
 *         description: Invalid order ID
 *       500:
 *         description: Error deleting order
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags:
 *      - Puts
 *     summary: Обновление заказ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               info:
 *                 type: string
 *                 example: Some info
 *               weight:
 *                 type: number
 *                 example: 1000
 *               from:
 *                 type: string
 *                 example: Moscow
 *               to:
 *                 type: string
 *                 example: Erevan
 *               date_start:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *               date_end:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-20
 *               status_id:
 *                  type: integer
 *                  example: 1
 *               user_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Missing required fields or Invalid order ID
 *       404:
 *         description: Order not found
 *       500:
 *          description: Error updating order
 */

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', uploadPhotos, OrderController.createOrder);
router.delete('/:id', OrderController.deleteOrderById);
router.put('/:id', OrderController.updateOrder);

export default router;
