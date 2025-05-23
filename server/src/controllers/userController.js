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
        return res
            .status(400)
            .json({ message: 'Не заполнены обязательные поля' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Некорректный формат email' });
    }

    if (!isValidPhone(phone)) {
        return res
            .status(400)
            .json({ message: 'Некорректный формат номера телефона' });
    }

    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Пользователь с этой почтой уже существует' });
        }

        await UserModel.createUser(email, phone, password);

        const newUser = await UserModel.getUserByEmail(email);

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.status(201).json({
            message: 'Успешная регистрация',
            accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Не заполнены обязательные поля' });
    }

    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Неверный email или пароль' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: 'Успешный вход',
            accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token обязателен' });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );

        const user = await UserModel.getUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const accessToken = generateAccessToken(user[0]);

        res.json({ accessToken });
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Неверный или просроченный refresh-токен' });
    }
}

export async function getUsers(req, res) {
    try {
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { users, total } = await UserModel.getUsers(page, limit);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Пользователи не найдены' });
        }

        res.status(200).json({ users, total });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор пользователя' });
    }

    try {
        const user = await UserModel.getUserById(id);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function deleteUserById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор пользователя' });
    }

    try {
        if (req.user.role_id !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const result = await UserModel.deleteUserById(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Пользователь удален' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { email, phone, role_id } = req.body;

    if (!id || isNaN(id) || !email || !phone || !role_id) {
        return res
            .status(400)
            .json({ message: 'Не заполнены обязательные поля' });
    }

    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
            return res
                .status(400)
                .json({ message: 'Пользователь с этой почтой уже существует' });
        }
        const isAdmin = req.user.role_id === 1;
        const isSelf = req.user.id === parseInt(id);

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .json({ message: 'Некорректный формат email' });
        }

        if (!isValidPhone(phone)) {
            return res
                .status(400)
                .json({ message: 'Некорректный формат номера телефона' });
        }

        if (!isAdmin && role_id !== req.user.role_id) {
            return res
                .status(403)
                .json({ message: 'Обновление роли доступно администратору' });
        }

        const result = await UserModel.updateUser(id, email, phone, role_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Профиль успешно обновлен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!id || isNaN(id) || !role_id) {
        return res.status(400).json({ message: 'Некорректные данные запроса' });
    }

    try {
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const result = await UserModel.updateUserRole(id, role_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Роль обновлена' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Почта обязательна' });
    }

    try {
        const user = await UserModel.getUserByEmail(email);

        if (!user) {
            return res.status(200).json({
                message:
                    'Если пользователь существует, письмо для сброса пароля было отправлено',
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
            message:
                'Если пользователь существует, письмо для сброса пароля было отправлено',
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function resetPassword(req, res) {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Токен и пароль обязательны' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Некорректный токен' });
        }

        const user = await UserModel.getUserByEmail(payload.email);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await UserModel.updatePassword(user.id, password);

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (err) {
        return res
            .status(400)
            .json({ message: 'Неверный или просроченный токен' });
    }
}

export async function updateUserPassword(req, res) {
    const { password } = req.body;
    const { id } = req.user;

    if (!password) {
        return res.status(400).json({ message: 'Некорректные данные запроса' });
    }

    try {
        const user = await UserModel.getUserById(id);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await UserModel.updatePassword(user[0].id, password);

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}
