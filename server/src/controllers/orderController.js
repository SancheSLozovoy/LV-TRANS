import * as OrderModel from '../models/orderModel.js';
import * as PhotoModel from '../models/photosModel.js';

export async function getOrders(req, res) {
    try {
        const orders = await OrderModel.getOrders();

        if (!orders.length) {
            return res.status(404).json({
                message: 'No orders found',
            });
        }

        res.status(200).json(orders);
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
        res.status(200).json(order[0]);
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

    if (
        !info ||
        !weight ||
        !from ||
        !to ||
        !date_start ||
        !date_end ||
        !user_id
    ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No photos uploaded' });
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
            await PhotoModel.addPhotoToOrder(result.insertId, file.buffer);
        }

        res.status(201).json({
            message: 'Order created and photos uploaded',
            orderId: result.insertId,
        });
    } catch (err) {
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
        const result = await OrderModel.deleteOrderById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
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
