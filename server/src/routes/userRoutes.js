import express from 'express';
import * as UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Получение всех пользователей (доступно только администратору)
 *     responses:
 *       200:
 *         description: Успешно получены все пользователи
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   login:
 *                     type: string
 *                     example: user123
 *                   phone:
 *                     type: string
 *                     example: 89381000000
 *                   password:
 *                     type: string
 *                     example: 432rewfds432sdDsdsad!dew
 *                   role_id:
 *                     type: integer
 *                     example: 1
 *       403:
 *         description: Доступ запрещен (если не администратор)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users not found
 *       404:
 *         description: Пользователи не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting users
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Логин пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Некорректный логин или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid login or password
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error logging in
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Получение пользователя по ID (пользователь может получить только себя, админ — любого)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                    type: integer
 *                    example: 3
 *                 login:
 *                    type: string
 *                    example: Login
 *                 phone:
 *                     type: string
 *                     example: 89381000000
 *                 password:
 *                    type: string
 *                    example: 432rewfds432sdDsdsad!dew
 *                 role_id:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       403:
 *         description: Доступ запрещен (если пользователь пытается получить данные другого пользователя без прав администратора)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting user
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Создание нового пользователя (регистрация)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                  type: string
 *                  example: Login
 *               phone:
 *                   type: string
 *                   example: 89381000000
 *               password:
 *                  type: string
 *                  example: 432rewfds432sdDsdsad!dew
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created
 *                 userId:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: Некорректные данные (отсутствуют обязательные поля или пользователь уже существует)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields or User already exists
 *       500:
 *         description: Ошибка сервера при создании пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating user
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Удаление пользователя по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       403:
 *         description: Отказано в доступе (пользователь может удалять только себя, администратор - любого)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting user
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Обновление пользователя по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                  type: string
 *                  example: Login
 *               phone:
 *                   type: string
 *                   example: 89381000000
 *               password:
 *                  type: string
 *                  example: 432rewfds432sdDsdsad!dew
 *               role_id:
 *                  type: integer
 *                  example: 1
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       403:
 *         description: Отказано в доступе (пользователь может обновлять только себя, администратор - любого)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     tags:
 *       - Users
 *     summary: Обновление роли пользователя по ID
 *     description: Доступно только администраторам. Позволяет изменить роль пользователя.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Роль обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role updated
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       403:
 *         description: Отказано в доступе (только администратор может обновлять роли)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating role
 *                 error:
 *                   type: string
 *                   example: Server error
 */

router.get('/', authenticateToken, UserController.getUsers);
router.get('/:id', authenticateToken, UserController.getUserById);
router.post('/', UserController.register);
router.post('/login', UserController.login);
router.delete('/:id', authenticateToken, UserController.deleteUserById);
router.put('/:id', authenticateToken, UserController.updateUser);
router.put('/:id/role', authenticateToken, UserController.updateUserRole);
router.post('/forgot-password', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);
router.post('/refresh-token', UserController.refreshToken);

export default router;
