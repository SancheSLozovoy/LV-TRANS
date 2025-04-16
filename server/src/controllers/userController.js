import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/userModel.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { getMailTemplate } from '../../getMailTemplate.js';

dotenv.config();

export async function register(req, res) {
    const { email, phone, password } = req.body;
    if (!email || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const result = await UserModel.createUser(email, phone, password);
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
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
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Users not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { users, total } = await UserModel.getUsers(page, limit);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Users not found' });
        }

        res.status(200).json({ users, total });
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

        if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
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
        if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

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
    const { email, phone, password, role_id } = req.body;

    if (!id || isNaN(id) || !email || !phone || !password || !role_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const result = await UserModel.updateUser(
            id,
            email,
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

export async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!id || isNaN(id) || !role_id) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const result = await UserModel.updateUserRole(id, role_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Role updated' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating role',
            error: err.message,
        });
    }
}

export async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await UserModel.getUserByEmail(email);

        if (!user) {
            return res.status(200).json({
                message: 'If user exists, a reset email has been sent',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                purpose: 'password-reset',
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30m',
            },
        );

        const resetUrl = `${process.env.FRONT_URL}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"LV-TRANS" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset your password',
            html: getMailTemplate(resetUrl),
        });

        res.status(200).json({
            message: 'If user exists, a reset email has been sent',
        });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({
            message: 'Error sending reset email',
            error: err.message,
        });
    }
}
