const express = require('express');
const { uploadFile, getFile, deleteFile } = require('../controllers/fileController');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - filename
 *         - originalName
 *         - mimetype
 *         - size
 *         - path
 *         - uploadedBy
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор файлу
 *           example: 1
 *         filename:
 *           type: string
 *           description: Ім'я файлу на сервері
 *           example: "file_123.png"
 *         originalName:
 *           type: string
 *           description: Оригінальне ім'я файлу
 *           example: "screenshot.png"
 *         mimetype:
 *           type: string
 *           description: Тип файлу
 *           example: "image/png"
 *         size:
 *           type: integer
 *           description: Розмір файлу у байтах
 *           example: 204800
 *         path:
 *           type: string
 *           description: Шлях зберігання файлу
 *           example: "/uploads/file_123.png"
 *         uploadedBy:
 *           type: integer
 *           description: ID користувача, який завантажив файл
 *           example: 1
 *         taskId:
 *           type: integer
 *           nullable: true
 *           description: ID завдання, до якого прикріплено файл
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення запису
 *           example: "2025-10-30T18:00:00.000Z"
 */


/**
* @swagger
* /api/files/upload:
*   post:
*     summary: Завантаження файлу
*     tags: [Files]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               file:
*                 type: string
*                 format: binary
*     responses:
*       201:
*         description: Файл успішно завантажено
*       400:
*         description: Файл не надано або невалідний
*       401:
*         description: Необхідна аутентифікація
*/
router.post('/upload', authenticate, upload.single('file'), uploadFile);

/**
* @swagger
* /api/files/{id}:
*   get:
*     summary: Отримання файлу за ID
*     tags: [Files]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Файл успішно отримано
*       404:
*         description: Файл не знайдено
*/
router.get('/:id', getFile);

/**
* @swagger
* /api/files/{id}:
*   delete:
*     summary: Видалення файлу
*     tags: [Files]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Файл успішно видалено
*       403:
*         description: Недостатньо прав
*       404:
*         description: Файл не знайдено
*/
router.delete('/:id', authenticate, deleteFile);

module.exports = router;