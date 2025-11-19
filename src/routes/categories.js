const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор категорії
 *           example: 1
 *         name:
 *           type: string
 *           description: Назва категорії
 *           example: "Work"
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Операції з категоріями
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Отримати всі категорії
 *     tags: [Categories]
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
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Порядок сортування
 *     responses:
 *       200:
 *         description: Список усіх категорій
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get("/", getAllCategories);


/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Отримати категорію за ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категорії
 *     responses:
 *       200:
 *         description: Категорія знайдена
 *       404:
 *         description: Категорію не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get("/:id", param("id").isInt(), getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Створити нову категорію
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Назва категорії
 *                 example: "Work"
 *     responses:
 *       201:
 *         description: Категорію створено успішно
 *       400:
 *         description: Помилка валідації
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.post("/", categoryValidation, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Оновити категорію за ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категорії
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Нова назва категорії
 *                 example: "Personal"
 *     responses:
 *       200:
 *         description: Категорію оновлено успішно
 *       400:
 *         description: Помилка валідації
 *       404:
 *         description: Категорію не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.put("/:id", param("id").isInt(), categoryValidation, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Видалити категорію за ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категорії
 *     responses:
 *       200:
 *         description: Категорію видалено успішно
 *       404:
 *         description: Категорію не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.delete("/:id", param("id").isInt(), deleteCategory);

module.exports = router;
