const prisma = require('../prisma');

async function createNotification(userId, message, title = "Time Planner", type = "INFO", priority = "MEDIUM") {
  try {
    const notification = await prisma.notification.create({
      data: { userId, message, title, type, priority, read: false },
    });
    return notification;
  } catch (err) {
    console.error("❌ Notification creation error:", err);
    throw err;
  }
}

// Одне сповіщення 
async function createSingleNotification(req, res) {
  const { userId, message, title, type, priority } = req.body;
  if (!userId || !message) return res.status(400).json({ message: "Потрібен userId та message" });

  try {
    const notification = await createNotification(userId, message, title, type, priority);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: "Не вдалося створити сповіщення" });
  }
}

// Масова відправка
async function createBatchNotifications(req, res) {
  const { users, message, title = "Time Planner", type = "INFO", priority = "MEDIUM" } = req.body;
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "Потрібен масив користувачів для відправки сповіщень" });
  }

  try {
    const notifications = await Promise.all(
      users.map(userId =>
        prisma.notification.create({
          data: { userId, message, title, type, priority, read: false },
        })
      )
    );
    res.status(201).json({ message: "Сповіщення відправлені", notifications });
  } catch (err) {
    console.error("❌ Batch notification error:", err);
    res.status(500).json({ message: "Не вдалося створити сповіщення" });
  }
}



// Отримати всі сповіщення користувача
async function getAllNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (err) {
    console.error("❌ GET /notifications error:", err);
    res.status(500).json({ message: "Не вдалося отримати сповіщення." });
  }
}

// Позначити конкретне сповіщення прочитаним
async function markNotificationRead(req, res) {
  try {
    const notification = await prisma.notification.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json(notification);
  } catch (err) {
    console.error("❌ PATCH /notifications/:id/read error:", err);
    res.status(500).json({ message: "Не вдалося позначити сповіщення як прочитане." });
  }
}

// Позначити всі сповіщення прочитаними
async function markAllRead(req, res) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ message: "Усі сповіщення позначені прочитаними." });
  } catch (err) {
    console.error("❌ PATCH /notifications/read-all error:", err);
    res.status(500).json({ message: "Не вдалося позначити всі сповіщення." });
  }
}

// Видалити конкретне сповіщення
async function deleteNotification(req, res) {
  try {
    await prisma.notification.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Сповіщення видалено." });
  } catch (err) {
    console.error("❌ DELETE /notifications/:id error:", err);
    res.status(500).json({ message: "Не вдалося видалити сповіщення." });
  }
}

// Видалити всі сповіщення користувача
async function deleteAllNotifications(req, res) {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user.id },
    });
    res.json({ message: "Усі сповіщення видалено." });
  } catch (err) {
    console.error("❌ DELETE /notifications error:", err);
    res.status(500).json({ message: "Не вдалося видалити всі сповіщення." });
  }
}



module.exports = {
  createSingleNotification,
  createBatchNotifications,
  getAllNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
};
