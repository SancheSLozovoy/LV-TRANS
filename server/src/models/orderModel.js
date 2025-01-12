import { pool } from '../db.js';

export async function getOrders() {
    const [rows] = await pool.query('SELECT * FROM orders');
    return rows;
}

export async function getOrderById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows;
}

export async function createOrder(
    info,
    weight,
    from,
    to,
    date_start,
    date_end,
    user_id,
) {
    const [result] = await pool.query(
        'INSERT INTO orders (info, weight, `from`, `to`, date_start, date_end, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [info, weight, from, to, date_start, date_end, user_id],
    );

    console.log(user_id);
    return result;
}

export async function deleteOrderById(id) {
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    return result;
}

export async function updateOrder(
    id,
    info,
    weight,
    from,
    to,
    date_start,
    date_end,
    status_id,
    user_id,
) {
    const [result] = await pool.query(
        'UPDATE orders SET info = ?, weight = ?, `from` = ?, `to` = ?, date_start = ?, date_end = ?, user_id = ?, status_id = ? WHERE id = ?',
        [info, weight, from, to, date_start, date_end, user_id, status_id, id],
    );
    return result;
}
