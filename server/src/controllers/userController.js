import * as UserModel from '../models/userModel.js';

export async function getUsers(req, res) {
    try {
        const users = await UserModel.getUsers();
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
    try {
        const user = await UserModel.getUserById(id);
        if (user.length === 0) {
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

export async function createUser(req, res) {
    const { login, phone, password } = req.body;
    try {
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

export async function deleteUserById(req, res) {
    const { id } = req.params;
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
