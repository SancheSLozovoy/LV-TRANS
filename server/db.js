import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function getUser(id) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id])
    return rows
}

export async function createUser(login, phone, password) {
    const result = await pool.query(`INSERT INTO users (login, password, phone) VALUES (?, ?, ?)`,  [login, password, phone])
    return result
}

const res = await getUser(1)
console.log(res)