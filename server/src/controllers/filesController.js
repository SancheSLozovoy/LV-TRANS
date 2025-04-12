import * as FilesModel from '../models/filesModel.js';
import { pool } from '../db.js';

export async function getFilesByOrderId(req, res) {
    const { orderId } = req.params;
    try {
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
            'SELECT file, file_name, file_type FROM files WHERE id = ?',
            [id],
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = rows[0];
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
