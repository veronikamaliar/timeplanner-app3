const { Server } = require("socket.io");
const { authenticateSocket } = require("../middleware/authSocket");
const { registerTaskHandlers } = require("./handlers/taskHandlers");
const { registerFileHandlers } = require("./handlers/fileHandlers");
const { registerTimelogHandlers } = require("./handlers/timelogHandlers");
const { registerUserHandlers } = require("./handlers/userHandlers");
const { registerNotificationHandlers } = require("./handlers/notificationHandlers");

const { getEventsSince } = require("./eventHistory"); 

const onlineUsers = new Map(); 

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    socket.userId = userId;

    console.log(`✅ Новий клієнт підключився: ${socket.id}, користувач: ${socket.user.name}`);

     socket.join(`user:${userId}`);
  console.log(`📌 Socket ${socket.id} приєднався до кімнати user:${userId}`);

    onlineUsers.set(userId, socket.id);
    io.emit("user:statusChanged", { userId, online: true });

    socket.on("joinRoom", (roomId) => {
      try {
        socket.join(roomId);
        console.log(`👥 Користувач ${socket.user.name} приєднався до кімнати ${roomId}`);
      } catch (err) {
        console.error("❌ joinRoom error:", err);
        socket.emit("error", { event: "joinRoom", message: err.message });
      }
    });

    socket.on("sync:events", (lastTimestamp) => {
      const missedEvents = getEventsSince(lastTimestamp || 0);
      socket.emit("sync:events", missedEvents);
    });

    registerTaskHandlers(io, socket);
    registerFileHandlers(io, socket);
    registerTimelogHandlers(io, socket);
    registerUserHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Користувач ${socket.user.name} відключився`);
      onlineUsers.delete(userId);
      io.emit("user:statusChanged", { userId, online: false });
    });
  });

  return io;
}

module.exports = { initSocket, onlineUsers };
