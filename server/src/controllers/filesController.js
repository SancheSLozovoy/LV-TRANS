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
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetails = order[0];

        if (req.user.role_id !== 1 && orderDetails.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const [files] = await pool.query(
            'SELECT id, file, file_name, file_type FROM files WHERE order_id = ?',
            [orderId],
        );

        if (files.length === 0) {
            return res
                .status(404)
                .json({ message: 'No files found for this order' });
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
        console.error('Error getting files:', err);
        res.status(500).json({
            message: 'Error getting files',
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
            return res.status(404).json({ message: 'File not found' });
        }

        const file = rows[0];

        if (req.user.role_id !== 1 && file.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const fileBase64 = file.file.toString('base64');

        res.status(200).json({
            file_name: file.file_name,
            file_type: file.file_type,
            file_base64: fileBase64,
            size: file.file.length,
        });
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({
            message: 'File download failed',
            error: err.message,
        });
    }
}

export async function uploadFileToOrder(req, res) {
    const { orderId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const order = await OrderModel.getOrderById(orderId);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetails = order[0];

        if (req.user.role_id !== 1 && orderDetails.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const decodedFileName = decodeURIComponent(escape(file.originalname));

        await addFilesToOrder(
            orderId,
            file.buffer,
            decodedFileName,
            file.mimetype,
        );

        res.status(201).json({ message: 'File uploaded' });
    } catch (err) {
        res.status(500).json({
            message: 'Error file upload',
            error: err.message,
        });
    }
}

export async function deleteFile(req, res) {
    const { id } = req.params;

    try {
        const file = await getFileWithUser(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (req.user.role_id !== 1 && file.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await deleteFileById(id);

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Delete file error:', err);
        res.status(500).json({
            message: 'File deletion failed',
            error: err.message,
        });
    }
}
