const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

class Environment {
  constructor() {
    this.validateRequiredEnvVars();
  }

  // SERVER
  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  }
  get PORT() {
    return parseInt(process.env.PORT, 10) || 5001;
  }
  get HOST() {
    return process.env.HOST || "localhost";
  }
  get isDevelopment() {
    return this.NODE_ENV === "development";
  }

  // DATABASE
  get database() {
    const host = process.env.DB_HOST || "localhost";
    const port = parseInt(process.env.DB_PORT, 10) || 5432;
    const name = process.env.DB_NAME || "dating_software";
    const user = process.env.DB_USER || "postgres";
    const password = process.env.DB_PASSWORD || "";

    return {
      host,
      port,
      name,
      user,
      password,
      url:
        process.env.DB_URL ||
        `postgresql://${user}:${password}@${host}:${port}/${name}`,
    };
  }

  // JWT
  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    };
  }

  // SECURITY
  get security() {
    return {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
      corsOrigin: process.env.CORS_ORIGIN || "*",
      corsCredentials: process.env.CORS_CREDENTIALS === "true",
    };
  }

  // FRONTEND
  get frontend() {
    return {
      url: process.env.FRONTEND_URL,
      mobileUrl: process.env.MOBILE_APP_URL,
    };
  }

  // CHECK ENV
  validateRequiredEnvVars() {
    const required = ["JWT_SECRET", "DB_PASSWORD"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.warn("⚠️ Missing required environment variables:", missing);
    }
  }

  // SUMMARY (chỉ log cần thiết)
  get summary() {
    return {
      environment: this.NODE_ENV,
      port: this.PORT,
      host: this.HOST,
      database: `${this.database.host}:${this.database.port}/${this.database.name}`,
      frontend: this.frontend.url,
    };
  }
}

module.exports = new Environment();