const prisma = require('../../prisma');
const { pushEvent } = require("../eventHistory");
const NotificationService = require("../../services/notificationService"); 
function registerUserHandlers(io, socket) {
  socket.on("user:create", async (data) => {
    try {
      const newUser = await prisma.user.create({ data });

      pushEvent("user:created", newUser);
      io.emit("user:created", newUser);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "USER_CREATED",
        message: `Створено нового користувача: ${newUser.name}`,
        meta: newUser
      });

    } catch (err) {
      console.error(err);
      socket.emit("user:error", { message: "Не вдалося створити користувача." });
    }
  });

  socket.on("user:update", async (data) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: data.id },
        data,
      });

      pushEvent("user:updated", updatedUser);
      io.emit("user:updated", updatedUser);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "USER_UPDATED",
        message: `Користувач оновлений: ${updatedUser.name}`,
        meta: updatedUser
      });

    } catch (err) {
      console.error(err);
      socket.emit("user:error", { message: "Не вдалося оновити користувача." });
    }
  });

  socket.on("user:delete", async (id) => {
    try {
      await prisma.user.delete({ where: { id } });

      pushEvent("user:deleted", id);
      io.emit("user:deleted", id);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "USER_DELETED",
        message: `Користувача видалено (ID: ${id})`,
        meta: { id }
      });

    } catch (err) {
      console.error(err);
      socket.emit("user:error", { message: "Не вдалося видалити користувача." });
    }
  });
}

module.exports = { registerUserHandlers };
