import express from 'express';
import * as OrderController from '../controllers/orderController.js';
import { uploadFiles } from '../middleware/upload.js';
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
 *                   example: "Доступ запрещен"
 *       404:
 *         description: Заказы не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Заказы не найдены"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка сервера"
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
 *                   example: "Недопустимый идентификатор заказа"
 *       403:
 *         description: Доступ запрещён (если у пользователя не роль администратора и заказ не его)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Доступ запрещен"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Заказ не найден"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка сервера"
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
 *                   example: "Заказ создан"
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
 *                   example: "Не заполнены обязательные поля"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка сервера"
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
 *                   example: "Заказ удален"
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Недопустимый идентификатор заказа"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Заказ не найден"
 *       403:
 *         description: Отказ в доступе (если пользователь не имеет прав для удаления)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Доступ запрещен"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка сервера"
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
 *                   example: "Заказ обновлен"
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Не заполнены обязательные поля"
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Заказ не найден"
 *       403:
 *         description: Отказ в доступе (если пользователь не имеет прав на обновление)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Доступ запрещен"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка сервера"
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
 *                   example: Недопустимый идентификатор пользователя
 *       403:
 *         description: Отказ в доступе (если запрашиваемый ID не соответствует текущему пользователю)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Заказы не найдены для данного пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: У пользователя нет заказов
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders/user/{userId}/active:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение заказов пользователя по его ID(активные)
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
 *                   example: Недопустимый идентификатор пользователя
 *       403:
 *         description: Отказ в доступе (если запрашиваемый ID не соответствует текущему пользователю)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Заказы не найдены для данного пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: У пользователя нет заказов
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Обновление статуса заказа
 *     description: Изменение статуса заказа (доступно только администраторам)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status_id
 *             properties:
 *               status_id:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 description: |
 *                   Новый статус заказа:
 *                   - 1 - Не принят
 *                   - 2 - Принят
 *                   - 3 - В пути
 *                   - 4 - Доставлен
 *     responses:
 *       200:
 *         description: Статус заказа успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Статус обновлен
 *       400:
 *         description: Некорректные данные
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Недопустимый идентификатор статуса
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Заказ не найден
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заказ не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 */

/**
 * @swagger
 * orders/metrics:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение метрик для административной панели
 *     description: Возвращает комплексные метрики системы (доступно только администраторам)
 *     responses:
 *       200:
 *         description: Успешный запрос метрик
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cargoAnalytics:
 *                   type: object
 *                   properties:
 *                     weightCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           weight_category:
 *                             type: string
 *                             example: "1-5 тонн"
 *                           orders_count:
 *                             type: integer
 *                             example: 15
 *                           avg_delivery_days:
 *                             type: number
 *                             format: float
 *                             example: 3.5
 *                           min_weight:
 *                             type: number
 *                             format: float
 *                             example: 1000
 *                           max_weight:
 *                             type: number
 *                             format: float
 *                             example: 5000
 *                           avg_weight:
 *                             type: number
 *                             format: float
 *                             example: 2500.75
 *                     volumeCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           volume_category:
 *                             type: string
 *                             example: "Крупногабаритный"
 *                           orders_count:
 *                             type: integer
 *                             example: 8
 *                           avg_volume:
 *                             type: number
 *                             format: float
 *                             example: 1201029738221.2
 *                           min_volume:
 *                             type: number
 *                             format: float
 *                             example: 33076161
 *                           max_volume:
 *                             type: number
 *                             format: float
 *                             example: 6000000000000
 *                 temporalAnalytics:
 *                   type: object
 *                   properties:
 *                     stuckOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           time_range:
 *                             type: string
 *                             example: "До 7 дней"
 *                           orders_count:
 *                             type: integer
 *                             example: 4
 *                           avg_weight:
 *                             type: number
 *                             format: float
 *                             example: 5488.25
 *                           avg_volume:
 *                             type: number
 *                             format: float
 *                             example: 1500030117838.4998
 *                 statusAnalytics:
 *                   type: object
 *                   properties:
 *                     totalWeight:
 *                       type: number
 *                       format: float
 *                       example: 4732
 *                     avgVolume:
 *                       type: number
 *                       format: float
 *                       example: 857879.7719891429
 *                     avgDeliveryTime:
 *                       type: string
 *                       example: "69.5714"
 *                     oversizedRatio:
 *                       type: object
 *                       properties:
 *                         standardCargoCount:
 *                           type: integer
 *                           example: 2
 *                         oversizedCargoCount:
 *                           type: integer
 *                           example: 5
 *                         oversizedPercentage:
 *                           type: string
 *                           example: "71.4286"
 *                     topUser:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         orders_count:
 *                           type: integer
 *                           example: 2
 *                         total_weight:
 *                           type: number
 *                           format: float
 *                           example: 20321
 *                         avg_weight:
 *                           type: number
 *                           format: float
 *                           example: 10160.5
 *                 businessKPI:
 *                   type: object
 *                   properties:
 *                     extremeParameters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: "Топ по весу"
 *                           id:
 *                             type: integer
 *                             example: 11
 *                           from:
 *                             type: string
 *                             example: "Ростов-на-Дону"
 *                           to:
 *                             type: string
 *                             example: "Москва"
 *                           weight:
 *                             type: number
 *                             format: float
 *                             example: 20000
 *                           length:
 *                             type: number
 *                             format: float
 *                             example: 10000
 *                           width:
 *                             type: number
 *                             format: float
 *                             example: 20000
 *                           height:
 *                             type: number
 *                             format: float
 *                             example: 30000
 *                           delivery_days:
 *                             type: integer
 *                             example: 1
 *                 complexMetrics:
 *                   type: object
 *                   description: Дополнительные комплексные метрики
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

router.get('/metrics', authenticateToken, OrderController.getDashboardMetrics);
router.get('/', authenticateToken, OrderController.getOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);
router.post('/', uploadFiles, authenticateToken, OrderController.createOrder);
router.delete('/:id', authenticateToken, OrderController.deleteOrderById);
router.put('/:id', authenticateToken, OrderController.updateOrder);
router.put('/:id/status', authenticateToken, OrderController.updateOrderStatus);
router.get(
    '/user/:userId',
    authenticateToken,
    OrderController.getOrdersByUserId,
);
router.get(
    '/user/:userId/active',
    authenticateToken,
    OrderController.getActiveOrdersByUserId,
);

export default router;
