const redis = require('../../../config/redis');

const AdminRedisContronller = {
  async getRedis(req, res) {
    try {
      const { key } = req.query;

      if (key) {
        // Lấy value của key cụ thể
        const value = await redis.get(key);
        res.json({
          success: true,
          data: {
            key,
            value: value ? JSON.parse(value) : null,
            type: "string",
          },
        });
      } else {
        // Lấy tất cả keys
        const keys = await redis.keys("*");
        const data = {};

        for (const k of keys.slice(0, 20)) {
          // Giới hạn 20 keys
          const value = await redis.get(k);
          data[k] = value ? JSON.parse(value) : null;
        }

        res.json({
          success: true,
          data: {
            keys: keys.slice(0, 20),
            values: data,
            totalKeys: keys.length,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching Redis data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch Redis data",
        error: error.message,
      });
    }
  },
};

module.exports = AdminRedisContronller;
