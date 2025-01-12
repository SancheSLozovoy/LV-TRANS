import { pool } from '../db.js';

export async function addPhotoToOrder(order_id, photo) {
    const [result] = await pool.query(
        'INSERT INTO photos (order_id, photo) VALUES (?, ?)',
        [order_id, photo],
    );
    return result;
}
