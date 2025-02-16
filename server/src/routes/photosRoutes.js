import express from 'express';
import * as PhotosController from '../controllers/photosController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /orders/{orderId}/photos:
 *   get:
 *     summary: Получение фотографий заказа по ID заказа
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Список фотографий заказа
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   photo:
 *                     type: string
 *                     description: Base64 закодированное изображение
 *                     example: "iVBORw0KGgoAAAANSUhEUgAAA..."
 *       404:
 *         description: Фотографии для данного заказа не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No photos found for this order
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting photos
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

router.get(
    '/:orderId/photos',
    authenticateToken,
    PhotosController.getPhotosByOrderId,
);

export default router;
