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
