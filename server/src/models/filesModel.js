import { pool } from '../db.js';

export async function addFilesToOrder(order_id, file) {
    const [result] = await pool.query(
        'INSERT INTO files (order_id, file) VALUES (?, ?)',
        [order_id, file],
    );
    return result;
}

export async function getFilesByOrderId(orderId) {
    const [rows] = await pool.query('SELECT * FROM files WHERE order_id = ?', [
        orderId,
    ]);
    return rows;
}
