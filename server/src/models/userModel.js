import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export async function getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await pool.query('SELECT * FROM users LIMIT ? OFFSET ?', [
        limit,
        offset,
    ]);

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM users',
    );

    return { users: rows, total };
}

export async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows;
}

export async function createUser(email, phone, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        'INSERT INTO users (email, password, phone) VALUES (?, ?, ?)',
        [email, hashedPassword, phone],
    );

    return result;
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
        email,
    ]);
    return rows.length ? rows[0] : null;
}

export async function deleteUserById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
}

export async function updateUser(id, email, phone, password, role_id) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [roleExists] = await pool.query(
        'SELECT COUNT(*) AS count FROM roles WHERE id = ?',
        [role_id],
    );

    if (roleExists[0].count === 0) {
        throw new Error(`Role with id ${role_id} does not exist`);
    }

    const [result] = await pool.query(
        'UPDATE users SET email = ?, phone = ?, password = ?, role_id = ? WHERE id = ?',
        [email, phone, hashedPassword, role_id, id],
    );
    return result;
}

export async function updateUserRole(id, role_id) {
    const [roleExists] = await pool.query(
        'SELECT COUNT(*) AS count FROM roles WHERE id = ?',
        [role_id],
    );

    if (roleExists[0].count === 0) {
        throw new Error(`Role with id ${role_id} does not exist`);
    }

    const [result] = await pool.query(
        'UPDATE users SET role_id = ? WHERE id = ?',
        [role_id, id],
    );

    return result;
}
