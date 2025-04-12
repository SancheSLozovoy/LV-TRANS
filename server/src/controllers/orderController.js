import * as OrderModel from '../models/orderModel.js';
import * as FilesModel from '../models/filesModel.js';

export async function getOrders(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { orders, total } = await OrderModel.getOrders(limit, offset);

        if (orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found',
            });
        }

        res.status(200).json({
            orders,
            total,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error getting orders',
            error: err.message,
        });
    }
}

export async function getOrderById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await OrderModel.getOrderById(id);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetails = order[0];

        if (req.user.role_id === 1 || orderDetails.user_id === req.user.id) {
            return res.status(200).json(orderDetails);
        }

        return res.status(403).json({ message: 'Access denied' });
    } catch (err) {
        res.status(500).json({
            message: 'Error getting order',
            error: err.message,
        });
    }
}

export async function createOrder(req, res) {
    const { info, weight, from, to, date_start, date_end, user_id } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const result = await OrderModel.createOrder(
            info,
            weight,
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
            message: 'Order created with files',
            orderId: result.insertId,
        });
    } catch (err) {
        console.error('Error in createOrder:', err);
        res.status(500).json({
            message: 'Error creating order',
            error: err.message,
        });
    }
}

export async function deleteOrderById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await OrderModel.getOrderById(id);
        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role_id !== 1 && order[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await OrderModel.deleteOrderById(id);
        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting order',
            error: err.message,
        });
    }
}

export async function updateOrder(req, res) {
    const { id } = req.params;
    const { info, weight, from, to, date_start, date_end, status_id, user_id } =
        req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    if (
        !info ||
        !weight ||
        !from ||
        !to ||
        !date_start ||
        !date_end ||
        !status_id ||
        !user_id
    ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const order = await OrderModel.getOrderById(id);
        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role_id !== 1 && order[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const result = await OrderModel.updateOrder(
            id,
            info,
            weight,
            from,
            to,
            date_start,
            date_end,
            status_id,
            user_id,
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating order',
            error: err.message,
        });
    }
}

export async function getOrdersByUserId(req, res) {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const orders = await OrderModel.getOrdersByUserId(userId);

        if (!orders.length) {
            return res.status(404).json({
                message: 'No orders found for this user',
            });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting orders by user ID',
            error: err.message,
        });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status_id } = req.body;

        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const result = await OrderModel.updateStatus(id, status_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating order status',
            error: err.message,
        });
    }
}
