import { pool } from '../db.js';

export async function addFilesToOrder(
    order_id,
    fileBuffer,
    fileName,
    fileType,
) {
    const [result] = await pool.query(
        'INSERT INTO files (order_id, file, file_name, file_type) VALUES (?, ?, ?, ?)',
        [order_id, fileBuffer, fileName, fileType],
    );
    return result;
}

export async function getFilesByOrderId(orderId) {
    const [rows] = await pool.query(
        'SELECT id, file_name, file_type, file FROM files WHERE order_id = ?',
        [orderId],
    );
    return rows;
}

export async function getFileById(fileId) {
    const [rows] = await pool.query('SELECT * FROM files WHERE id = ?', [
        fileId,
    ]);
    return rows;
}
