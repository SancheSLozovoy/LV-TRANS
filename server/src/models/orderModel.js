import { pool } from '../db.js';

export async function getOrders(limit = 10, offset = 0) {
    const [rows] = await pool.query(
        `
        SELECT 
            orders.*, 
            users.email AS user_email, 
            users.phone AS user_phone
        FROM orders
        JOIN users ON orders.user_id = users.id
        ORDER BY id DESC
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
    );

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM orders',
    );

    return { orders: rows, total };
}

export async function getOrderById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows;
}

export async function createOrder(
    info,
    weight,
    length,
    width,
    height,
    from,
    to,
    date_start,
    date_end,
    user_id,
) {
    const [result] = await pool.query(
        'INSERT INTO orders (info, weight, length, width, height, `from`, `to`, date_start, date_end, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            info,
            weight,
            length,
            width,
            height,
            from,
            to,
            date_start,
            date_end,
            user_id,
        ],
    );

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
    length,
    width,
    height,
    from,
    to,
    date_start,
    date_end,
    status_id,
    user_id,
) {
    const [result] = await pool.query(
        'UPDATE orders SET info = ?, weight = ?, length = ?, width = ?, height = ?, `from` = ?, `to` = ?, date_start = ?, date_end = ?, user_id = ?, status_id = ? WHERE id = ?',
        [
            info,
            weight,
            length,
            width,
            height,
            from,
            to,
            date_start,
            date_end,
            user_id,
            status_id,
            id,
        ],
    );
    return result;
}

export async function getOrdersByUserId(userId, limit = 8, offset = 0) {
    const [rows] = await pool.query(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
        [userId, limit, offset],
    );

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
        [userId],
    );

    return { orders: rows, total };
}

export async function getActiveOrdersByUserId(userId, limit = 8, offset = 0) {
    const [rows] = await pool.query(
        `SELECT * FROM orders 
         WHERE user_id = ? 
         AND status_id != 4 
         ORDER BY create_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset],
    );

    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) as total 
         FROM orders 
         WHERE user_id = ? 
         AND status_id != 4`,
        [userId],
    );

    return {
        orders: rows,
        total: Number(total),
    };
}

export async function updateStatus(id, status_id) {
    const [result] = await pool.query(
        'UPDATE orders SET status_id = ? WHERE id = ?',
        [status_id, id],
    );
    return result;
}

export async function getStatusById(status_id) {
    const [rows] = await pool.query('SELECT * FROM status WHERE id = ?', [
        status_id,
    ]);
    return rows;
}
