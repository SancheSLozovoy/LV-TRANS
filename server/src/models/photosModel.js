import { pool } from '../db.js';

export async function addPhotoToOrder(order_id, photo) {
    const [result] = await pool.query(
        'INSERT INTO photos (order_id, photo) VALUES (?, ?)',
        [order_id, photo],
    );
    return result;
}

export async function getPhotosByOrderId(orderId) {
    const [rows] = await pool.query('SELECT * FROM photos WHERE order_id = ?', [
        orderId,
    ]);
    return rows;
}
