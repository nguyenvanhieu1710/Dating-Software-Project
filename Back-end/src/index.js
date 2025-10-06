const express = require("express");
const http = require("http");
const routes = require("./routes/index");

// Import core modules
const {
  setupMiddleware,
  setupErrorHandler,
  setupGracefulShutdown,
  startServer,
} = require("./core");

// Import config
const env = require("./config/environment");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Setup middleware
setupMiddleware(app, env);

// API routes
app.use("/api", routes);

// Init socket
const io = initSocket(server);

// Setup error handler
setupErrorHandler(app);

// Setup graceful shutdown
setupGracefulShutdown(server);

// Start server
startServer(server, env);

// Export for testing
module.exports = { app, server, io };
