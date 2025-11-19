const prisma = require('../prisma');
const { validationResult } = require("express-validator");


// Отримати всі таймлоги користувача
const getAllTimelogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      userId,
      taskId,
      startDate,
      endDate,
      sortBy = 'startTime',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (userId) where.userId = parseInt(userId);
    if (taskId) where.taskId = parseInt(taskId);
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const orderBy = {};
    orderBy[sortBy] = order;

    const [timelogs, total] = await Promise.all([
      prisma.timelog.findMany({
        where,
        include: { task: true, user: { select: { id: true, name: true, email: true } } },
        skip,
        take: parseInt(limit),
        orderBy
      }),
      prisma.timelog.count({ where })
    ]);

    res.json({
      data: timelogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + timelogs.length < total
      }
    });

  } catch (error) {
    console.error("Get timelogs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Отримати таймлог за ID
const getTimelogById = async (req, res) => {
  try {
    const { id } = req.params;

    const timelog = await prisma.timelog.findUnique({
      where: { id: parseInt(id) },
      include: { task: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!timelog) return res.status(404).json({ error: "Timelog not found" });

    res.json(timelog);
  } catch (error) {
    console.error("Get timelog error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Створити таймлог
const createTimelog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { taskId, userId, startTime, endTime } = req.body;

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    const duration = end ? (end - start) / 1000 / 60 / 60 : null; 

    const timelog = await prisma.timelog.create({
      data: {
        taskId,
        userId,
        startTime: start,
        endTime: end,
        duration,
      },
      include: { task: true },
    });

    res.status(201).json({ message: "Timelog created successfully", timelog });
  } catch (error) {
    console.error("Create timelog error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Оновити таймлог
const updateTimelog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { startTime, endTime } = req.body;

    const start = startTime ? new Date(startTime) : undefined;
    const end = endTime ? new Date(endTime) : undefined;
    let duration = undefined;

    if (start && end) duration = (end - start) / 1000 / 60 / 60;
    else if (start || end) {
      const oldTimelog = await prisma.timelog.findUnique({ where: { id: parseInt(id) } });
      if (oldTimelog) {
        const s = start || oldTimelog.startTime;
        const e = end || oldTimelog.endTime;
        if (s && e) duration = (e - s) / 1000 / 60 / 60;
      }
    }

    const timelog = await prisma.timelog.update({
      where: { id: parseInt(id) },
      data: {
        startTime: start,
        endTime: end,
        duration,
      },
      include: { task: true },
    });

    res.json({ message: "Timelog updated successfully", timelog });
  } catch (error) {
    console.error("Update timelog error:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Timelog not found" });
    res.status(500).json({ error: "Internal server error" });
  }
};

// Видалити таймлог
const deleteTimelog = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.timelog.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Timelog deleted successfully" });
  } catch (error) {
    console.error("Delete timelog error:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Timelog not found" });
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllTimelogs,
  getTimelogById,
  createTimelog,
  updateTimelog,
  deleteTimelog,
};
