const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

const userValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("birthDate")
    .isISO8601()
    .toDate()
    .withMessage("birthDate must be a valid date"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Операції з користувачами (доступ лише для ADMIN)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - birthDate
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор користувача
 *         name:
 *           type: string
 *           description: Ім'я користувача
 *           example: "Name Surname"
 *         email:
 *           type: string
 *           description: Електронна пошта користувача
 *           example: "user@gmail.com"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Дата народження користувача
 *           example: "2002-09-18"
 *         password:
 *           type: string
 *           description: Пароль користувача (зберігається у хешованому вигляді)
 *           example: "password123"
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           description: Роль користувача у системі
 *           example: "USER"
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: URL аватарки користувача
 *           example: "avatar.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення користувача
 *           example: "2025-10-30T18:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата останнього оновлення користувача
 *           example: "2025-10-30T18:10:00.000Z"
 */


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Отримати список усіх користувачів
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість користувачів на сторінку
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук по імені або email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN]
 *         description: Фільтр за роллю
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, email, createdAt]
 *           default: name
 *         description: Поле для сортування
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Напрям сортування
 *     responses:
 *       200:
 *         description: Успішно отримано список користувачів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       403:
 *         description: Доступ заборонено (немає прав ADMIN)
 */
router.get("/", authenticate, authorize("ADMIN"), getAllUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Отримати користувача за ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор користувача
 *     responses:
 *       200:
 *         description: Успішно отримано користувача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено
 */
router.get("/:id", param("id").isInt(), authenticate, authorize("ADMIN"), getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Створити нового користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Користувача успішно створено
 *       400:
 *         description: Некоректні дані
 *       403:
 *         description: Доступ заборонено
 */
router.post("/", authenticate, authorize("ADMIN"), userValidation, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Оновити дані користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Користувача успішно оновлено
 *       404:
 *         description: Користувача не знайдено
 */
router.put("/:id", param("id").isInt(), authenticate, authorize("ADMIN"), userValidation, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор користувача
 *     responses:
 *       200:
 *         description: Користувача успішно видалено
 *       404:
 *         description: Користувача не знайдено
 */
router.delete("/:id", param("id").isInt(), authenticate, authorize("ADMIN"), deleteUser);

module.exports = router;
