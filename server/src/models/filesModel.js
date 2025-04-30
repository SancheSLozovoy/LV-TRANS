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

export async function getFileWithUser(id) {
    const [rows] = await pool.query(
        `SELECT f.id, o.user_id
     FROM files f
     JOIN orders o ON f.order_id = o.id
     WHERE f.id = ?`,
        [id],
    );
    return rows[0];
}

export async function deleteFileById(id) {
    const [result] = await pool.query('DELETE FROM files WHERE id = ?', [id]);
    return result;
}
