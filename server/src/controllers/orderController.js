import * as OrderModel from '../models/orderModel.js';
import * as FilesModel from '../models/filesModel.js';
import { statusChange } from '../../emailTemplates/statusChange.js';
import { transporter } from '../middleware/emailTransporter.js';

export async function getOrders(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const { orders, total } = await OrderModel.getOrders(limit, offset);

        if (orders.length === 0) {
            return res.status(404).json({
                message: 'Заказы не найдены',
            });
        }

        res.status(200).json({
            orders,
            total,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function getOrderById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор заказа' });
    }

    try {
        const order = await OrderModel.getOrderById(id);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const orderDetails = order[0];

        if (req.user.role_id === 1 || orderDetails.user_id === req.user.id) {
            return res.status(200).json(orderDetails);
        }

        return res.status(403).json({ message: 'Доступ запрещен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function createOrder(req, res) {
    const {
        info,
        weight,
        length,
        width,
        height,
        from,
        to,
        date_start,
        date_end,
        user_id,
    } = req.body;
    const files = req.files;

    if (
        !info ||
        !weight ||
        !length ||
        !width ||
        !height ||
        !from ||
        !to ||
        !date_start ||
        !date_end ||
        !user_id ||
        !files ||
        files.length === 0
    ) {
        return res
            .status(400)
            .json({ message: 'Не заполнены обязательные поля' });
    }

    try {
        const result = await OrderModel.createOrder(
            info,
            weight,
            length,
            width,
            height,
            from,
            to,
            date_start,
            date_end,
            user_id,
        );

        for (const file of files) {
            const decodedFileName = decodeURIComponent(
                escape(file.originalname),
            );

            await FilesModel.addFilesToOrder(
                result.insertId,
                file.buffer,
                decodedFileName,
                file.mimetype,
            );
        }

        res.status(201).json({
            message: 'Заказ создан',
            orderId: result.insertId,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function deleteOrderById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор заказа' });
    }

    try {
        const order = await OrderModel.getOrderById(id);
        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        if (req.user.role_id !== 1 && order[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        await OrderModel.deleteOrderById(id);
        res.status(200).json({ message: 'Заказ удален' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function updateOrder(req, res) {
    const { id } = req.params;
    const {
        info,
        weight,
        length,
        width,
        height,
        from,
        to,
        date_start,
        date_end,
        status_id,
        user_id,
    } = req.body;

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор заказа' });
    }

    if (
        !info ||
        !weight ||
        !length ||
        !width ||
        !height ||
        !from ||
        !to ||
        !date_start ||
        !date_end ||
        !status_id ||
        !user_id
    ) {
        return res
            .status(400)
            .json({ message: 'Не заполнены обязательные поля' });
    }

    try {
        const order = await OrderModel.getOrderById(id);
        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        if (req.user.role_id !== 1 && order[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const result = await OrderModel.updateOrder(
            id,
            info,
            weight,
            length,
            width,
            height,
            from,
            to,
            date_start,
            date_end,
            status_id,
            user_id,
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }
        res.status(200).json({ message: 'Заказ обновлен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}

export async function getOrdersByUserId(req, res) {
    const userId = Number(req.params.userId);
    const currentUserId = req.user.id;

    if (!userId || isNaN(userId)) {
        return res
            .status(400)
            .json({ message: 'Недопустимый идентификатор пользователя' });
    }

    if (userId !== currentUserId) {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { orders, total } = await OrderModel.getOrdersByUserId(
            userId,
            limit,
            offset,
        );

        if (!orders.length) {
            return res
                .status(404)
                .json({ message: 'У пользователя нет заказов' });
        }

        return res.status(200).json({ orders, total });
    } catch (error) {
        return res.status(500).json({
            message: 'Ошибка сервера',
            error: error.message,
        });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status_id, email } = req.body;

        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const result = await OrderModel.updateStatus(id, status_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const statusResult = await OrderModel.getStatusById(status_id);
        if (!statusResult || statusResult.length === 0) {
            return res
                .status(400)
                .json({ message: 'Недопустимый идентификатор статуса' });
        }

        const statusName = statusResult[0].name;

        const statusTranslations = {
            'NOT ACCEPTED': 'Не принят',
            ACCEPT: 'Принят',
            'ON TRANSIT': 'В пути',
            DELIVERED: 'Доставлен',
        };

        const russianStatus = statusTranslations[statusName] || statusName;

        const mailOptions = {
            from: `"LV-TRANS" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Изменение статуса заказа',
            html: statusChange(id, russianStatus),
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Статус обновлен' });
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
}
