import { pool } from '../db.js';

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows;
}

export async function createUser(login, phone, password) {
    const [result] = await pool.query(
        'INSERT INTO users (login, password, phone) VALUES (?, ?, ?)',
        [login, password, phone],
    );
    return result;
}

export async function deleteUserById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
}

export async function updateUser(id, login, phone, password, role_id) {
    const [roleExists] = await pool.query(
        'SELECT COUNT(*) AS count FROM roles WHERE id = ?',
        [role_id],
    );

    if (roleExists[0].count === 0) {
        throw new Error(`Role with id ${role_id} does not exist`);
    }
    
    const [result] = await pool.query(
        'UPDATE users SET login = ?, phone = ?, password = ?, role_id = ? WHERE id = ?',
        [login, phone, password, role_id, id],
    );
    return result;
}
