const express = require("express");
const http = require("http");
const routes = require("./routes/index");

// Import core modules
const {
  setupMiddleware,
  setupHealthCheck,
  setupErrorHandler,
  ServiceManager,
  setupGracefulShutdown,
  startServer,
} = require("./core");

// Import environment config
const env = require("./config/environment");

const app = express();
const server = http.createServer(app);

// Setup middleware
setupMiddleware(app, env);

// Setup health check
setupHealthCheck(app, null, env); // socketManager will be set later

// API routes
app.use("/api", routes);

// Setup error handler
setupErrorHandler(app);

// Initialize service manager
const serviceManager = new ServiceManager(server);

// Setup graceful shutdown
setupGracefulShutdown(server, serviceManager);

// Start server
startServer(server, env, serviceManager);

// Export for testing
module.exports = { app, server, serviceManager };
