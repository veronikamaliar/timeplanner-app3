const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllTimelogs,
  getTimelogById,
  createTimelog,
  updateTimelog,
  deleteTimelog,
} = require("../controllers/timelogController");

const router = express.Router();

const timelogValidation = [
  body("userId").isInt().withMessage("userId must be an integer"),
  body("taskId").isInt().withMessage("taskId must be an integer"),
  body("startTime").isISO8601().toDate().withMessage("startTime must be a valid date"),
  body("endTime").optional().isISO8601().toDate(),
  body("duration").optional().isFloat({ min: 0 }),
];

/**
 * @swagger
 * tags:
 *   name: Timelogs
 *   description: Операції з Timelogs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Timelog:
 *       type: object
 *       required:
 *         - userId
 *         - taskId
 *         - startTime
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор запису
 *         userId:
 *           type: integer
 *           description: Ідентифікатор користувача
 *         taskId:
 *           type: integer
 *           description: Ідентифікатор завдання
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Час початку роботи
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Час завершення роботи
 *         duration:
 *           type: number
 *           description: Тривалість у годинах
 */

/**
 * @swagger
 * /api/timelogs:
 *   get:
 *     summary: Отримати всі записи часу
 *     tags: [Timelogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки для пагінації
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість записів на сторінку
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Фільтр по ID користувача
 *       - in: query
 *         name: taskId
 *         schema:
 *           type: integer
 *         description: Фільтр по ID завдання
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Початкова дата для фільтрації таймлогів
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Кінцева дата для фільтрації таймлогів
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: startTime
 *           enum: [startTime, endTime, duration, createdAt]
 *         description: Поле для сортування
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: desc
 *           enum: [asc, desc]
 *         description: Порядок сортування
 *     responses:
 *       200:
 *         description: Список усіх записів часу
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Timelog'
 */
router.get("/", getAllTimelogs);

/**
 * @swagger
 * /api/timelogs/{id}:
 *   get:
 *     summary: Отримати запис часу за ID
 *     tags: [Timelogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ідентифікатор запису
 *     responses:
 *       200:
 *         description: Успішно отримано запис
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timelog'
 *       404:
 *         description: Запис не знайдено
 */
router.get("/:id", param("id").isInt(), getTimelogById);

/**
 * @swagger
 * /api/timelogs:
 *   post:
 *     summary: Створити новий запис часу
 *     tags: [Timelogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Timelog'
 *     responses:
 *       201:
 *         description: Успішно створено новий запис
 */
router.post("/", timelogValidation, createTimelog);

/**
 * @swagger
 * /api/timelogs/{id}:
 *   put:
 *     summary: Оновити запис часу
 *     tags: [Timelogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Timelog'
 *     responses:
 *       200:
 *         description: Запис успішно оновлено
 *       404:
 *         description: Запис не знайдено
 */
router.put("/:id", param("id").isInt(), timelogValidation, updateTimelog);

/**
 * @swagger
 * /api/timelogs/{id}:
 *   delete:
 *     summary: Видалити запис часу
 *     tags: [Timelogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Запис успішно видалено
 *       404:
 *         description: Запис не знайдено
 */
router.delete("/:id", param("id").isInt(), deleteTimelog);

module.exports = router;
