const prisma = require('../../prisma');

const { pushEvent } = require("../eventHistory");


function registerNotificationHandlers(io, socket) {

  socket.on("notification:create", async ({ userId, type, title, message }) => {
    try {
      const notification = await prisma.notification.create({
  data: {
    userId,
    type,
    title,
    message,
    read: false
  }
});


      pushEvent({
        type: "notification:create",
        timestamp: Date.now(),
        payload: notification,
      });

      io.to(`user:${userId}`).emit("notification:new", notification);

    } catch (err) {
      console.error("❌ notification:create error", err);
      socket.emit("error", {
        event: "notification:create",
        message: err.message,
      });
    }
  });

  socket.on("notification:read", async ({ notificationId }) => {
    try {
      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });

      saveEvent({
        type: "notification:read",
        timestamp: Date.now(),
        payload: updated,
      });

      io.to(`user:${updated.userId}`).emit("notification:updated", updated);
    } catch (err) {
      socket.emit("error", {
        event: "notification:read",
        message: err.message,
      });
    }
  });
}

module.exports = { registerNotificationHandlers };
