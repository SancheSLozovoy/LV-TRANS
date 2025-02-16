import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

export async function register(req, res) {
    const { login, phone, password } = req.body;
    if (!login || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.getUserByLogin(login);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const result = await UserModel.createUser(login, phone, password);
        res.status(201).json({
            message: 'User created',
            userId: result.insertId,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error creating user',
            error: err.message,
        });
    }
}

export async function login(req, res) {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.getUserByLogin(login);
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid login or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Invalid login or password' });
        }

        const token = jwt.sign(
            { id: user.id, login: user.login },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({
            message: 'Error logging in',
            error: err.message,
        });
    }
}

export async function getUsers(req, res) {
    try {
        const users = await UserModel.getUsers();
        if (users.length === 0) {
            return res.status(404).json({ message: 'Users not found' });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting users',
            error: err.message,
        });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await UserModel.getUserById(id);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting user',
            error: err.message,
        });
    }
}

export async function deleteUserById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await UserModel.deleteUserById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting user',
            error: err.message,
        });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { login, phone, password, role_id } = req.body;
    if (!id || isNaN(id) || !login || !phone || !password || !role_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await UserModel.updateUser(
            id,
            login,
            phone,
            password,
            role_id,
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating user',
            error: err.message,
        });
    }
}
