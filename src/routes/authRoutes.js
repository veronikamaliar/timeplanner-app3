const express = require('express');
const { register, login, refreshToken, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticateToken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Забагато спроб входу, спробуйте пізніше" },
});

/**
* @swagger
* /api/auth/register:
*   post:
*     summary: Реєстрація нового користувача
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*               - name
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*                 minLength: 8
*               name:
*                 type: string
*     responses:
*       201:
*         description: Користувач успішно зареєстрований
*       400:
*         description: Помилка валідації даних
*       409:
*         description: Користувач вже існує
*/
router.post('/register', register);

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Вхід користувача
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*     responses:
*       200:
*         description: Успішний вхід
*       401:
*         description: Невірні дані для входу
*/
router.post('/login', authLimiter, login);

/**
* @swagger
* /api/auth/change-password:
*   put:
*     summary: Зміна паролю користувача
*     tags: [Authentication]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - oldPassword
*               - newPassword
*             properties:
*               oldPassword:
*                 type: string
*                 description: Поточний пароль користувача
*               newPassword:
*                 type: string
*                 minLength: 8
*                 description: Новий пароль користувача
*     responses:
*       200:
*         description: Пароль успішно змінено
*       400:
*         description: Неправильний поточний пароль або помилка валідації
*       401:
*         description: Користувач неавторизований
*/
router.put('/change-password', authenticateToken, changePassword);


/**
* @swagger
* /api/auth/refresh:
*   post:
*     summary: Оновлення access токену
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - refreshToken
*             properties:
*               refreshToken:
*                 type: string
*     responses:
*       200:
*         description: Токен успішно оновлено
*       401:
*         description: Недійсний refresh токен
*/
router.post('/refresh', refreshToken);

/**
* @swagger
* /api/auth/forgot-password:
*   post:
*     summary: Відновлення паролю через email
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*             properties:
*               email:
*                 type: string
*                 format: email
*     responses:
*       200:
*         description: Лист для відновлення паролю відправлено
*       404:
*         description: Користувача з таким email не знайдено
*       500:
*         description: Помилка сервера
*/
router.post('/forgot-password', forgotPassword);

// === Додати GET для форми зміни паролю ===
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.send(`
        <form action="/api/auth/reset-password/${token}" method="POST">
            <input type="password" name="newPassword" placeholder="Новий пароль" required />
            <button type="submit">Змінити пароль</button>
        </form>
    `);
});


router.post('/reset-password/:token', resetPassword);


module.exports = router;