import express from 'express';
import * as OrderController from '../controllers/orderController.js';
import { uploadPhotos } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
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
 *       404:
 *         description: Заказы не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No orders found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting orders
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение заказа по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ найден
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
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid order ID
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting order
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Создание нового заказа
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
 *         description: Заказ создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created and photos uploaded
 *                 orderId:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: Некорректные данные или не загружены фото
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating order
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Удаление заказа по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid order ID
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting order
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Обновление заказа по ID
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
 *               status_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Зазаз обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       404:
 *         description: Зазаз не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating order
 *                 error:
 *                   type: string
 *                   example: Server error
 */

router.get('/', authenticateToken, OrderController.getOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);
router.post('/', uploadPhotos, authenticateToken, OrderController.createOrder);
router.delete('/:id', authenticateToken, OrderController.deleteOrderById);
router.put('/:id', authenticateToken, OrderController.updateOrder);
router.get('/user/:userId', OrderController.getOrdersByUserId);

export default router;
