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
 *                   email:
 *                     type: string
 *                     example: email
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
 *                   example: Доступ запрещен
 *       404:
 *         description: Пользователи не найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователи не найдены
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Логин пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email пользователя
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
 *                   example: Успешный вход
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
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
 *                   example: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
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
 *                 email:
 *                    type: string
 *                    example: email
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
 *                   example: Недопустимый идентификатор пользователя
 *       403:
 *         description: Доступ запрещен (если пользователь пытается получить данные другого пользователя без прав администратора)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Создание нового пользователя (регистрация)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: email
 *               phone:
 *                 type: string
 *                 example: 89381000000
 *               password:
 *                 type: string
 *                 example: 432rewfds432sdDsdsad!dew
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
 *                   example: Успешная регистрация
 *                 userId:
 *                   type: integer
 *                   example: 20
 *       400_required:
 *         description: Не заполнены обязательные поля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Не заполнены обязательные поля
 *       400_exists:
 *         description: Пользователь с этой почтой уже существует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь с этой почтой уже существует
 *       400_email:
 *         description: Некорректный формат email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректный формат email
 *       400_phone:
 *         description: Некорректный формат номера телефона
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректный формат номера телефона
 *       500:
 *         description: Ошибка сервера при создании пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
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
 *                   example: Пользователь удален
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Недопустимый идентификатор пользователя
 *       403:
 *         description: Отказано в доступе (пользователь может удалять только себя, администратор - любого)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
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
 *               email:
 *                  type: string
 *                  example: email
 *               phone:
 *                   type: string
 *                   example: 89381000000
 *               role_id:
 *                  type: integer
 *                  example: 1
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Профиль успешно обновлен
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Не заполнены обязательные поля
 *       400_email:
 *         description: Некорректный формат email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректный формат email
 *       400_phone:
 *         description: Некорректный формат номера телефона
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректный формат номера телефона
 *       403:
 *         description: Отказано в доступе (пользователь может обновлять только себя, администратор - любого)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
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
 *                   example: Роль обновлена
 *       400:
 *         description: Некорректные данные или ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректные данные запроса
 *       403:
 *         description: Отказано в доступе (только администратор может обновлять роли)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * users/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Запрос сброса пароля
 *     description: Отправляет письмо с ссылкой для сброса пароля на указанную почту
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Письмо отправлено (если пользователь существует)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Если пользователь существует, письмо для сброса пароля было отправлено
 *       400:
 *         description: Не указана почта
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Почта обязательна
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 *                 error:
 *                   type: string
 *                   example: Error details
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Сброс пароля
 *     description: Устанавливает новый пароль пользователя по токену из письма
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Пароль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пароль успешно обновлен
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Токен и пароль обязательны
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Некорректный токен
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Неверный или просроченный токен
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 */

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Обновление пароля пользователя
 *     description: Обновляет пароль текущего авторизованного пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePassword123
 *     responses:
 *       200:
 *         description: Пароль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пароль успешно обновлен
 *       400:
 *         description: Некорректные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некорректные данные запроса
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка сервера
 */

router.get('/', authenticateToken, UserController.getUsers);
router.get('/:id', authenticateToken, UserController.getUserById);
router.post('/', UserController.register);
router.post('/login', UserController.login);
router.delete('/:id', authenticateToken, UserController.deleteUserById);
router.put('/:id', authenticateToken, UserController.updateUser);
router.put('/:id/role', authenticateToken, UserController.updateUserRole);
router.post(
    '/update-password',
    authenticateToken,
    UserController.updateUserPassword,
);
router.post('/forgot-password', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);
router.post('/refresh-token', UserController.refreshToken);

export default router;
