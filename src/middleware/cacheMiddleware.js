const myCache = require("../cache");

/**
 * Middleware для кешування даних
 * @param {string} key - ключ кешу
 * @param {number} ttl - час життя кешу в секундах 
 */
function cacheMiddleware(key, ttl = 600) {
  return (req, res, next) => {
    const cachedData = myCache.get(key);

    if (cachedData) {
      return res.json({ source: "cache", data: cachedData });
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
  if (body.data) {
    myCache.set(key, body.data, ttl); 
  } else {
    myCache.set(key, body, ttl);
  }
  return originalJson(body);
};


    next();
  };
}

module.exports = cacheMiddleware;
