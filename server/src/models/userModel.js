import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows;
}

export async function createUser(login, phone, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        'INSERT INTO users (login, password, phone) VALUES (?, ?, ?)',
        [login, hashedPassword, phone],
    );

    return result;
}

export async function getUserByLogin(login) {
    const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [
        login,
    ]);
    return rows.length ? rows[0] : null;
}

export async function deleteUserById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
}

export async function updateUser(id, login, phone, password, role_id) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [roleExists] = await pool.query(
        'SELECT COUNT(*) AS count FROM roles WHERE id = ?',
        [role_id],
    );

    if (roleExists[0].count === 0) {
        throw new Error(`Role with id ${role_id} does not exist`);
    }

    const [result] = await pool.query(
        'UPDATE users SET login = ?, phone = ?, password = ?, role_id = ? WHERE id = ?',
        [login, phone, hashedPassword, role_id, id],
    );
    return result;
}
