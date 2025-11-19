const prisma = require('../../prisma');
const { pushEvent } = require("../eventHistory");
const NotificationService = require("../../services/notificationService"); 

function registerTaskHandlers(io, socket) {
  socket.on("task:create", async (data) => {
    try {
      const newTask = await prisma.task.create({
        data: { ...data, userId: socket.user.id },
      });

      pushEvent("task:created", newTask);
      io.emit("task:created", newTask);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "TASK_CREATED",
        message: `Створено нову задачу: ${newTask.title}`,
        meta: newTask
      });

    } catch (err) {
      console.error(err);
      socket.emit("task:error", { message: "Не вдалося створити задачу." });
    }
  });

  socket.on("task:update", async (data) => {
    try {
      const updated = await prisma.task.update({
        where: { id: data.id },
        data,
      });

      pushEvent("task:updated", updated);
      io.emit("task:updated", updated);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "TASK_UPDATED",
        message: `Задача оновлена: ${updated.title}`,
        meta: updated
      });

    } catch (err) {
      console.error(err);
      socket.emit("task:error", { message: "Не вдалося оновити задачу." });
    }
  });

  socket.on("task:delete", async (id) => {
    try {
      await prisma.task.delete({ where: { id } });

      pushEvent("task:deleted", id);
      io.emit("task:deleted", id);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "TASK_DELETED",
        message: `Задачу видалено (ID: ${id})`,
        meta: { id }
      });

    } catch (err) {
      console.error(err);
      socket.emit("task:error", { message: "Не вдалося видалити задачу." });
    }
  });
}

module.exports = { registerTaskHandlers };
