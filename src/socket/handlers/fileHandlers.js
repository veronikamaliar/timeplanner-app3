const prisma = require('../../prisma');
const { pushEvent } = require("../eventHistory");
const NotificationService = require("../../services/notificationService"); 

function registerFileHandlers(io, socket) {
  socket.on("file:upload", async (data) => {
    try {
      const newFile = await prisma.file.create({
        data: {
          filename: data.filename,
          originalName: data.originalName,
          mimetype: data.mimetype,
          size: data.size,
          path: data.path,
          uploadedBy: socket.user.id,
          taskId: data.taskId,
        },
      });

      pushEvent("file:uploaded", newFile);
      io.emit("file:uploaded", newFile);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "FILE_UPLOADED",
        message: `Завантажено новий файл: ${newFile.originalName}`,
        meta: newFile
      });

    } catch (err) {
      console.error(err);
      socket.emit("file:error", { message: "Не вдалося завантажити файл." });
    }
  });

  socket.on("file:delete", async (fileId) => {
    try {
      await prisma.file.delete({ where: { id: fileId } });

      pushEvent("file:deleted", fileId);
      io.emit("file:deleted", fileId);

      await NotificationService.createNotification({
        userId: socket.user.id,
        type: "FILE_DELETED",
        message: `Файл видалено (ID: ${fileId})`,
        meta: { id: fileId }
      });

    } catch (err) {
      console.error(err);
      socket.emit("file:error", { message: "Не вдалося видалити файл." });
    }
  });
}

module.exports = { registerFileHandlers };
