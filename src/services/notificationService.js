const prisma = require('../prisma');


async function createNotification(userId, type, message) {
  try {
    const notification = await prisma.notification.create({
      data: { userId, type, message }
    });

    return notification;
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
}


async function notifyUsers(io, userIds, type, message) {
  const notifications = [];

  for (const uid of userIds) {
    const n = await createNotification(uid, type, message);
    notifications.push(n);

    io.to(`user:${uid}`).emit("notification:new", n);
  }

  return notifications;
}

module.exports = {
  createNotification,
  notifyUsers
};
