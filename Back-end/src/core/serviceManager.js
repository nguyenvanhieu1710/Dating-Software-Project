const redisManager = require("../config/redis");
const SocketManager = require("../config/socket");

class ServiceManager {
  constructor(server) {
    this.server = server;
    this.socketManager = null;
  }

  async initializeServices() {
    try {
      // Initialize Redis
      await redisManager.connect();
      console.log('✅ Redis connected successfully');

      // Initialize Socket.io
      this.socketManager = new SocketManager(this.server);

      // Set socket manager in message controller
      const MessageController = require("../app/controllers/messageController");
      const messageController = new MessageController();
      messageController.setSocketManager(this.socketManager);

      // Update health check with socket manager
      const { setupHealthCheck } = require('./healthCheck');
      setupHealthCheck(require('express')(), this.socketManager, require('../config/environment'));

      return this.socketManager;
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      // Shutdown Socket.io
      if (this.socketManager) {
        await this.socketManager.shutdown();
        console.log('✅ Socket.io server shutdown complete');
      }

      // Disconnect Redis
      await redisManager.disconnect();
      console.log('✅ Redis disconnected');

      // Close database connections
      const pool = require("../config/database/index");
      await pool.end();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

module.exports = ServiceManager;
