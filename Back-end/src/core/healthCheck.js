const setupHealthCheck = (app, socketManager, env) => {
  app.get('/health', async (req, res) => {
    try {
      if (socketManager) {
        const stats = await socketManager.getServerStats();
        res.json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: env.summary,
          socket: stats
        });
      } else {
        res.json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: env.summary
        });
      }
    } catch (error) {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: env.summary
      });
    }
  });
};

module.exports = { setupHealthCheck };
