const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, пароль та ім\'я є обов\'язковими'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: 'Пароль має містити мінімум 8 символів'
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Користувач з таким email вже існує'
            });
        }

        const hashedPassword = await hashPassword(password);

        const { role } = req.body;
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'USER'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        res.status(201).json({
            message: 'Користувача успішно зареєстровано',
            user,
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Помилка реєстрації:', error);
        res.status(500).json({
            error: 'Помилка сервера при реєстрації'
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email та пароль є обов\'язковими'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Невірний email або пароль'
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Невірний email або пароль'
            });
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Успішний вхід',
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Помилка входу:', error);
        res.status(500).json({
            error: 'Помилка сервера при вході'
        });
    }
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Будь ласка, заповніть усі поля" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Невірний старий пароль" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Пароль успішно змінено" });
  } catch (error) {
    console.error("Помилка при зміні паролю:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: 'Refresh токен відсутній'
            });
        }

        const decoded = verifyRefreshToken(refreshToken);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(404).json({
                error: 'Користувача не знайдено'
            });
        }

        const newAccessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id);

        res.json({
            tokens: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        console.error('Помилка оновлення токену:', error);
        res.status(401).json({
            error: 'Недійсний refresh токен'
        });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600 * 1000); 

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry: expiry }
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER, 
                pass: process.env.ETHEREAL_PASS
            }
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000/api/auth";

        const info = await transporter.sendMail({
            from: `"TimePlanner" <${process.env.ETHEREAL_USER}>`,
            to: email,
            subject: "Відновлення паролю",
            html: `<p>Щоб скинути пароль, перейдіть за посиланням:</p>
                   <a href="${frontendUrl}/reset-password/${token}">Скинути пароль</a>`
        });

        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

        res.json({ message: "Лист для відновлення паролю відправлено" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка сервера" });
    }
}

async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: "Невірний або прострочений токен" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: "Пароль успішно змінено" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка сервера" });
    }
}


module.exports = {
    register,
    login,
    changePassword,
    refreshToken,
    forgotPassword,
    resetPassword
};