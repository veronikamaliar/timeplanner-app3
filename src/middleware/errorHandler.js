const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);

  // Prisma помилки
  if (error.code === "P2002") {
    return res.status(400).json({
      error: "Duplicate entry",
      message: "Resource with this data already exists",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      error: "Not found",
      message: "Requested resource not found",
    });
  }

  // JWT помилки
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      message: "Please provide a valid authentication token",
    });
  }

  // Валідація помилки
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      message: error.message,
    });
  }

  // Загальна помилка сервера
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
};

module.exports = errorHandler;