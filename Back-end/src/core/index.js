const { setupMiddleware } = require('./middleware');
const { setupErrorHandler } = require('./errorHandler');
const { setupGracefulShutdown } = require('./gracefulShutdown');
const { startServer } = require('./serverStartup');

module.exports = {
  setupMiddleware,
  setupErrorHandler,
  setupGracefulShutdown,
  startServer
};
