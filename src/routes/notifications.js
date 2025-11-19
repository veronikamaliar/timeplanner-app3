const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const {
  createSingleNotification,
  createBatchNotifications,
  getAllNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationsController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - message
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *         message:
 *           type: string
 *         read:
 *           type: boolean
 *         type:
 *           type: string
 *           enum: [INFO, WARNING, ALERT, TASK]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         userId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Операції зі сповіщеннями
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Створити одне сповіщення
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: Ідентифікатор користувача
 *                 example: 3
 *               title:
 *                 type: string
 *                 description: Заголовок сповіщення
 *                 example: "Система"
 *               message:
 *                 type: string
 *                 description: Текст сповіщення
 *                 example: "Нове завдання призначено"
 *               type:
 *                 type: string
 *                 enum: [INFO, WARNING, ALERT, TASK]
 *                 default: INFO
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 default: MEDIUM
 *     responses:
 *       201:
 *         description: Сповіщення створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Некоректні дані
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */

/**
 * @swagger
 * /api/notifications/batch:
 *   post:
 *     summary: Створити сповіщення для кількох користувачів
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *               - message
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Масив ID користувачів
 *                 example: [1,2,3]
 *               title:
 *                 type: string
 *                 description: Заголовок сповіщення
 *                 example: "Система"
 *               message:
 *                 type: string
 *                 description: Текст сповіщення
 *                 example: "Нове завдання призначено"
 *               type:
 *                 type: string
 *                 enum: [INFO, WARNING, ALERT, TASK]
 *                 default: INFO
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 default: MEDIUM
 *     responses:
 *       201:
 *         description: Сповіщення створено для всіх користувачів
 *       400:
 *         description: Некоректні дані
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */



/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Отримати всі сповіщення користувача
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список сповіщень
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 *
 *   delete:
 *     summary: Видалити всі сповіщення користувача
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Усі сповіщення видалено
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Позначити конкретне сповіщення як прочитане
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор сповіщення
 *     responses:
 *       200:
 *         description: Сповіщення позначено як прочитане
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Позначити всі сповіщення користувача як прочитані
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Усі сповіщення позначені прочитаними
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Видалити конкретне сповіщення
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор сповіщення
 *     responses:
 *       200:
 *         description: Сповіщення видалено
 *       401:
 *         description: Користувач не авторизований
 *       500:
 *         description: Внутрішня помилка сервера
 */

router.post("/", authenticateToken, createSingleNotification);     
router.post("/batch", authenticateToken, createBatchNotifications);
router.get("/", authenticateToken, getAllNotifications);
router.patch("/:id/read", authenticateToken, markNotificationRead);
router.patch("/read-all", authenticateToken, markAllRead);
router.delete("/:id", authenticateToken, deleteNotification);
router.delete("/", authenticateToken, deleteAllNotifications);

module.exports = router;
