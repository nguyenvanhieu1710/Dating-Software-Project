const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const setupMiddleware = (app, env) => {
  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    })
  );

  // Compression middleware
  app.use(compression());

  // CORS configuration
  app.use(
    cors({
      // origin: env.security.corsOrigin,
      origin: "*",
      credentials: env.security.corsCredentials,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Admin-Request"],
    })
  );

  // Body parsing middleware
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

  // Static files - serve with proper headers for images
  app.use("/api/uploads", express.static(path.join(__dirname, "../../uploads"), {
    setHeaders: (res, path) => {
      // Set proper MIME types for images
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (path.endsWith('.gif')) {
        res.setHeader('Content-Type', 'image/gif');
      }
      // Allow cross-origin access
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
};

module.exports = { setupMiddleware };
