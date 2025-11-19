const express = require("express");
const router = express.Router();
const cacheMiddleware = require("../middleware/cacheMiddleware");

router.get("/", cacheMiddleware("rareData", 600), async (req, res) => {
  const dataFromDB = {
    message: "Дані з бази даних",
    timestamp: new Date()
  };

  res.json({ source: "db", data: dataFromDB });
});

module.exports = router;
