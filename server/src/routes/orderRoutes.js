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
 *     security:
 *       - bearerAuth: []  # Авторизация через токен
 *     responses:
 *       200:
 *         description: Список всех заказов
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
 *                     example: "Some info"
 *                   weight:
 *                     type: integer
 *                     example: 1500
 *                   from:
 *                     type: string
 *                     example: "Rostov-on-Don"
 *                   to:
 *                     type: string
 *                     example: "Orel"
 *                   create_at:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-12"
 *                   date_start:
 *                     type: string
 *                     format: date
 *                     example: "2026-04-01"
 *                   date_end:
 *                     type: string
 *                     format: date
 *                     example: "2026-05-03"
 *                   status_id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 3
 *       403:
 *         description: Доступ запрещён (если у пользователя не роль администратора)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       404:
 *         description: Заказы не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No orders found"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting orders"
 *                 error:
 *                   type: string
 *                   example: "Server error"
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
 *     security:
 *       - bearerAuth: []  # Авторизация через токен
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
 *                   example: "Info"
 *                 weight:
 *                   type: number
 *                   example: 5000
 *                 from:
 *                   type: string
 *                   example: "From"
 *                 to:
 *                   type: string
 *                   example: "To"
 *                 create_at:
 *                   type: string
 *                   format: date
 *                   example: "2025-10-10"
 *                 date_start:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-12"
 *                 date_end:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-12"
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
 *                   example: "Invalid order ID"
 *       403:
 *         description: Доступ запрещён (если у пользователя не роль администратора и заказ не его)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting order"
 *                 error:
 *                   type: string
 *                   example: "Server error"
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
 *                 description: Информация о заказе
 *               weight:
 *                 type: number
 *                 description: Вес груза
 *               from:
 *                 type: string
 *                 description: Место отправления
 *               to:
 *                 type: string
 *                 description: Место назначения
 *               date_start:
 *                 type: string
 *                 format: date
 *                 description: Дата начала перевозки
 *               date_end:
 *                 type: string
 *                 format: date
 *                 description: Дата завершения перевозки
 *               user_id:
 *                 type: integer
 *                 description: ID пользователя, который создает заказ
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Фотографии, прикрепленные к заказу
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
 *                   example: "Order created and photos uploaded"
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
 *                   example: "Missing required fields"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating order"
 *                 error:
 *                   type: string
 *                   example: "Server error"
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
 *                   example: "Order deleted"
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid order ID"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       403:
 *         description: Отказ в доступе (если пользователь не имеет прав для удаления)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting order"
 *                 error:
 *                   type: string
 *                   example: "Server error"
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
 *                 description: Информация о заказе
 *               weight:
 *                 type: number
 *                 description: Вес заказа
 *               from:
 *                 type: string
 *                 description: Место отправления
 *               to:
 *                 type: string
 *                 description: Место назначения
 *               date_start:
 *                 type: string
 *                 format: date
 *                 description: Дата начала выполнения заказа
 *               date_end:
 *                 type: string
 *                 format: date
 *                 description: Дата окончания выполнения заказа
 *               status_id:
 *                 type: integer
 *                 description: Статус заказа (например, 1 — новый, 2 — в процессе и т.д.)
 *               user_id:
 *                 type: integer
 *                 description: ID пользователя, который сделал заказ
 *     responses:
 *       200:
 *         description: Заказ обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order updated"
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       403:
 *         description: Отказ в доступе (если пользователь не имеет прав на обновление)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating order"
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение заказов пользователя по его ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Заказы пользователя успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 20
 *                   info:
 *                     type: string
 *                     example: Info about the order
 *                   weight:
 *                     type: number
 *                     example: 5000
 *                   from:
 *                     type: string
 *                     example: From place
 *                   to:
 *                     type: string
 *                     example: To place
 *                   create_at:
 *                     type: string
 *                     format: date
 *                     example: 2025-10-10
 *                   date_start:
 *                     type: string
 *                     format: date
 *                     example: 2025-12-12
 *                   date_end:
 *                     type: string
 *                     format: date
 *                     example: 2025-12-12
 *                   status_id:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: Некорректный ID пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       403:
 *         description: Отказ в доступе (если запрашиваемый ID не соответствует текущему пользователю)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Заказы не найдены для данного пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No orders found for this user
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting orders by user ID
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
