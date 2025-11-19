const prisma = require('../../prisma');
const { pushEvent } = require("../eventHistory");
const NotificationService = require("../../services/notificationService"); // ✅ додаємо

function registerTimelogHandlers(io, socket) {
  socket.on("timelog:start", async (data) => {
    try {
      const timelog = await prisma.timelog.create({
        data: {
          userId: socket.user.id,
          taskId: data.taskId,
          startTime: new Date(),
        },
      });

      pushEvent("timelog:started", timelog);
      io.emit("timelog:started", timelog);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "TIMELOG_STARTED",
        message: `Таймлог запущено для задачі ID: ${timelog.taskId}`,
        meta: timelog
      });

    } catch (err) {
      console.error(err);
      socket.emit("timelog:error", { message: "Не вдалося запустити таймлог." });
    }
  });

  socket.on("timelog:stop", async (data) => {
    try {
      const active = await prisma.timelog.findFirst({
        where: { userId: socket.user.id, taskId: data.taskId, endTime: null },
      });

      if (!active) return;

      const endTime = new Date();
      const duration = (endTime - active.startTime) / 1000 / 60;

      const updated = await prisma.timelog.update({
        where: { id: active.id },
        data: { endTime, duration },
      });

      pushEvent("timelog:stopped", updated);
      io.emit("timelog:stopped", updated);
      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "TIMELOG_STOPPED",
        message: `Таймлог зупинено для задачі ID: ${updated.taskId}. Тривалість: ${duration.toFixed(2)} хв.`,
        meta: updated
      });

    } catch (err) {
      console.error(err);
      socket.emit("timelog:error", { message: "Не вдалося зупинити таймлог." });
    }
  });
}

module.exports = { registerTimelogHandlers };
