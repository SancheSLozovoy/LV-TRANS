import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/userModel.js';
import dotenv from 'dotenv';
import { forgotPassword } from '../../emailTemplates/forgotPassword.js';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../middleware/generateToken.js';
import { transporter } from '../middleware/emailTransporter.js';
import { isValidEmail, isValidPhone } from '../middleware/validation.js';

dotenv.config();

export async function register(req, res) {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isValidPhone(phone)) {
        return res.status(400).json({ message: 'Invalid phone format' });
    }

    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await UserModel.createUser(email, phone, password);

        const newUser = await UserModel.getUserByEmail(email);

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.status(201).json({
            message: 'User created',
            accessToken,
            refreshToken,
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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error logging in',
            error: err.message,
        });
    }
}

export async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );

        const user = await UserModel.getUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken(user[0]);

        res.json({ accessToken });
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Invalid or expired refresh token' });
    }
}

export async function getUsers(req, res) {
    try {
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Access denied' });
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
        const isAdmin = req.user.role_id === 1;
        const isSelf = req.user.id === parseInt(id);

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone format' });
        }

        if (!isAdmin && role_id !== req.user.role_id) {
            return res
                .status(403)
                .json({ message: 'You are not allowed to change your role' });
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

        await transporter.sendMail({
            from: `"LV-TRANS" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Восстановление пароля',
            html: forgotPassword(resetUrl),
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

export async function resetPassword(req, res) {
    const { token, password } = req.body;

    if (!token || !password) {
        return res
            .status(400)
            .json({ message: 'Token and password are required' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Invalid token purpose' });
        }

        const user = await UserModel.getUserByEmail(payload.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updatePassword(user.id, hashedPassword);

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (err) {
        console.error('Reset error:', err);
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
}
