import express from 'express';
import * as FilesController from '../controllers/filesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { uploadFile } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /orders/{orderId}/files:
 *   get:
 *     summary: Получение файлов заказа по ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Список файлов заказа
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
 *                   file_name:
 *                     type: string
 *                     example: document.pdf
 *                   file_type:
 *                     type: string
 *                     example: application/pdf
 *                   file_base64:
 *                     type: string
 *                     description: Base64-кодированное содержимое файла
 *                     example: JVBERi0xLjQKJ...
 *                   size:
 *                     type: integer
 *                     example: 123456
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Заказ или файлы не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No files found for this order
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting files
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

/**
 * @swagger
 * /orders/files/{fileId}:
 *   get:
 *     summary: Загрузка одного файла по ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Успешная загрузка файла
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file_name:
 *                   type: string
 *                   example: document.pdf
 *                 file_type:
 *                   type: string
 *                   example: application/pdf
 *                 file_base64:
 *                   type: string
 *                   description: Base64-кодированное содержимое файла
 *                   example: JVBERi0xLjQKJ...
 *                 size:
 *                   type: integer
 *                   example: 123456
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Файл не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File download failed
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

/**
 * @swagger
 * /{orderId}/files:
 *   post:
 *     summary: Подгрузка файла заказу
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Успешная загрузка файла
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
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
 *                   example: Error file upload
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Удаление файлов
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Успешное удаление файла
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File deleted successfully
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Файл не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File deletion failed
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

router.get(
    '/:orderId/files',
    authenticateToken,
    FilesController.getFilesByOrderId,
);

router.get('/files/:id', authenticateToken, FilesController.downloadFile);
router.post(
    '/:orderId/files',
    uploadFile,
    authenticateToken,
    FilesController.uploadFileToOrder,
);
router.delete('/files/:id', authenticateToken, FilesController.deleteFile);

export default router;
