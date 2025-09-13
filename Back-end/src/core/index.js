const { setupMiddleware } = require('./middleware');
const { setupHealthCheck } = require('./healthCheck');
const { setupErrorHandler } = require('./errorHandler');
const ServiceManager = require('./serviceManager');
const { setupGracefulShutdown } = require('./gracefulShutdown');
const { startServer } = require('./serverStartup');

module.exports = {
  setupMiddleware,
  setupHealthCheck,
  setupErrorHandler,
  ServiceManager,
  setupGracefulShutdown,
  startServer
};
