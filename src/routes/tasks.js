const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

const taskValidation = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),
  body("priority")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),
  body("description").optional().isString(),
  body("dueDate").optional().isISO8601().toDate(),
  body("completed").optional().isBoolean(),
  body("timeSpent").optional().isFloat({ min: 0 }),
  body("attachment").optional().isString(),
  body("categoryId").optional().isInt(),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - priority
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор завдання
 *         title:
 *           type: string
 *           description: Назва завдання
 *           example: "Finish project"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Опис завдання
 *           example: "Complete backend by Sunday"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Дата завершення завдання
 *           example: "2025-11-01T12:00:00.000Z"
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           description: Пріоритет завдання
 *           example: "HIGH"
 *         timeSpent:
 *           type: number
 *           nullable: true
 *           description: Час, витрачений на завдання
 *           example: 3.5
 *         completed:
 *           type: boolean
 *           description: Статус завершення завдання
 *           example: false
 *         userId:
 *           type: integer
 *           description: Ідентифікатор користувача
 *           example: 1
 *         categoryId:
 *           type: integer
 *           nullable: true
 *           description: Ідентифікатор категорії завдання
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення завдання
 *           example: "2025-10-30T18:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата останнього оновлення завдання
 *           example: "2025-10-30T18:10:00.000Z"
 */


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Операції з завданнями
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Отримати всі завдання
 *     tags: [Tasks]
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
 *         description: Кількість елементів на сторінку
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук по назві або опису завдання
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Фільтр по категорії
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         description: Фільтр по пріоритету
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Фільтр по завершенню
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, dueDate, priority, createdAt, updatedAt]
 *         description: Поле для сортування
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Порядок сортування
 *     responses:
 *       200:
 *         description: Список усіх завдань
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get("/", getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Отримати завдання за ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID завдання
 *     responses:
 *       200:
 *         description: Завдання знайдено
 *       404:
 *         description: Завдання не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get("/:id", param("id").isInt(), getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Створити нове завдання
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Finish project"
 *               description:
 *                 type: string
 *                 example: "Complete backend by Sunday"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "HIGH"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               completed:
 *                 type: boolean
 *                 example: false
 *               timeSpent:
 *                 type: number
 *                 example: 3.5
 *               attachment:
 *                 type: string
 *                 example: "screenshot.png"
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Завдання створено успішно
 *       400:
 *         description: Помилка валідації
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.post("/", taskValidation, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Оновити завдання за ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID завдання
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Update documentation"
 *               description:
 *                 type: string
 *                 example: "Add Swagger for all routes"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "MEDIUM"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-05"
 *               completed:
 *                 type: boolean
 *                 example: true
 *               timeSpent:
 *                 type: number
 *                 example: 5.5
 *               attachment:
 *                 type: string
 *                 example: "updated_file.pdf"
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Завдання оновлено успішно
 *       400:
 *         description: Помилка валідації
 *       404:
 *         description: Завдання не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.put("/:id", param("id").isInt(), taskValidation, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Видалити завдання за ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID завдання
 *     responses:
 *       200:
 *         description: Завдання видалено успішно
 *       404:
 *         description: Завдання не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.delete("/:id", param("id").isInt(), deleteTask);

module.exports = router;
