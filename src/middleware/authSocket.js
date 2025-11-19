const jwt = require("jsonwebtoken");
const prisma = require('../prisma');

async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("❌ Немає токена");
      return next(new Error("Authentication error"));
    }
const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return next(new Error("User not found"));

    socket.user = user; 
    next();
  } catch (err) {
    console.error("❌ JWT помилка:", err.message);
    next(new Error("Authentication failed"));
  }
}

module.exports = { authenticateSocket };
