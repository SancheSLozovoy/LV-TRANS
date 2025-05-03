import { pool } from '../db.js';
import * as OrderModel from '../models/orderModel.js';
import {
    addFilesToOrder,
    deleteFileById,
    getFileWithUser,
} from '../models/filesModel.js';

export async function getFilesByOrderId(req, res) {
    const { orderId } = req.params;

    try {
        const order = await OrderModel.getOrderById(orderId);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const orderDetails = order[0];

        if (req.user.role_id !== 1 && orderDetails.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const [files] = await pool.query(
            'SELECT id, file, file_name, file_type FROM files WHERE order_id = ?',
            [orderId],
        );

        if (files.length === 0) {
            return res
                .status(404)
                .json({ message: 'Файлы для этого заказа не найдены' });
        }

        const filesData = files.map((file) => ({
            id: file.id,
            file_name: file.file_name,
            file_type: file.file_type,
            file_base64: file.file.toString('base64'),
            size: file.file.length,
        }));

        res.status(200).json(filesData);
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function downloadFile(req, res) {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT f.file, f.file_name, f.file_type, o.user_id
             FROM files f
             JOIN orders o ON f.order_id = o.id
             WHERE f.id = ?`,
            [id],
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Файл не найден' });
        }

        const file = rows[0];

        if (req.user.role_id !== 1 && file.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const fileBase64 = file.file.toString('base64');

        res.status(200).json({
            file_name: file.file_name,
            file_type: file.file_type,
            file_base64: fileBase64,
            size: file.file.length,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function uploadFileToOrder(req, res) {
    const { orderId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Файлы не были загружены' });
    }

    try {
        const order = await OrderModel.getOrderById(orderId);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const orderDetails = order[0];

        if (req.user.role_id !== 1 && orderDetails.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const decodedFileName = decodeURIComponent(escape(file.originalname));

        await addFilesToOrder(
            orderId,
            file.buffer,
            decodedFileName,
            file.mimetype,
        );

        res.status(201).json({ message: 'Файл загружен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function deleteFile(req, res) {
    const { id } = req.params;

    try {
        const file = await getFileWithUser(id);

        if (!file) {
            return res.status(404).json({ message: 'Файл не найден' });
        }

        if (req.user.role_id !== 1 && file.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        await deleteFileById(id);

        res.status(200).json({ message: 'Файл успешно удален' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}
