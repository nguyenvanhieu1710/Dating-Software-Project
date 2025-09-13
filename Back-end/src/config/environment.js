const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class Environment {
  constructor() {
    this.validateRequiredEnvVars();
  }

  // ========================================
  // SERVER CONFIGURATION
  // ========================================
  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  }

  get PORT() {
    return parseInt(process.env.PORT) || 5000;
  }

  get HOST() {
    return process.env.HOST || 'localhost';
  }

  get isDevelopment() {
    return this.NODE_ENV === 'development';
  }

  get isProduction() {
    return this.NODE_ENV === 'production';
  }

  get isTest() {
    return this.NODE_ENV === 'test';
  }

  // ========================================
  // DATABASE CONFIGURATION
  // ========================================
  get database() {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      name: process.env.DB_NAME || 'dating_software',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      url: process.env.DB_URL || `postgresql://${this.database.user}:${this.database.password}@${this.database.host}:${this.database.port}/${this.database.name}`,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX) || 20,
        idleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000
      }
    };
  }

  // ========================================
  // JWT CONFIGURATION
  // ========================================
  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    };
  }

  // ========================================
  // REDIS CONFIGURATION
  // ========================================
  get redis() {
    return {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB) || 0
    };
  }

  // ========================================
  // SOCKET.IO CONFIGURATION
  // ========================================
  get socket() {
    return {
      corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
      pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
      pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
      maxHttpBufferSize: parseInt(process.env.SOCKET_MAX_HTTP_BUFFER_SIZE) || 1e6
    };
  }

  // ========================================
  // FIREBASE CONFIGURATION
  // ========================================
  get firebase() {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    };
  }

  // ========================================
  // EMAIL CONFIGURATION
  // ========================================
  get email() {
    return {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || 'noreply@yourdatingapp.com',
      secure: process.env.EMAIL_SECURE === 'true'
    };
  }

  // ========================================
  // FILE UPLOAD CONFIGURATION
  // ========================================
  get upload() {
    return {
      maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10485760, // 10MB
      allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif'],
      path: process.env.UPLOAD_PATH || './uploads',
      tempPath: process.env.UPLOAD_TEMP_PATH || './uploads/temp'
    };
  }

  // ========================================
  // SECURITY CONFIGURATION
  // ========================================
  get security() {
    return {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      corsCredentials: process.env.CORS_CREDENTIALS === 'true'
    };
  }

  // ========================================
  // LOGGING CONFIGURATION
  // ========================================
  get logging() {
    return {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE || './logs/app.log',
      maxSize: process.env.LOG_MAX_SIZE || '20m',
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 14
    };
  }

  // ========================================
  // CACHE CONFIGURATION
  // ========================================
  get cache() {
    return {
      ttl: parseInt(process.env.CACHE_TTL) || 3600,
      checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600,
      maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 1000
    };
  }

  // ========================================
  // MESSAGE CONFIGURATION
  // ========================================
  get message() {
    return {
      maxLength: parseInt(process.env.MESSAGE_MAX_LENGTH) || 1000,
      rateLimit: parseInt(process.env.MESSAGE_RATE_LIMIT) || 20,
      rateWindow: parseInt(process.env.MESSAGE_RATE_WINDOW) || 60,
      typingTimeout: parseInt(process.env.TYPING_TIMEOUT) || 2000
    };
  }

  // ========================================
  // MATCH CONFIGURATION
  // ========================================
  get match() {
    return {
      distanceRadius: parseInt(process.env.MATCH_DISTANCE_RADIUS) || 50,
      ageRangeMin: parseInt(process.env.MATCH_AGE_RANGE_MIN) || 18,
      ageRangeMax: parseInt(process.env.MATCH_AGE_RANGE_MAX) || 65,
      maxDailyLikes: parseInt(process.env.MATCH_MAX_DAILY_LIKES) || 50
    };
  }

  // ========================================
  // FRONTEND URLs
  // ========================================
  get frontend() {
    return {
      url: process.env.FRONTEND_URL || 'http://localhost:3000',
      mobileUrl: process.env.MOBILE_APP_URL || 'exp://localhost:19000',
      adminUrl: process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001'
    };
  }

  // ========================================
  // THIRD-PARTY SERVICES
  // ========================================
  get services() {
    return {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      },
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        s3Bucket: process.env.AWS_S3_BUCKET
      },
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
      }
    };
  }

  // ========================================
  // MONITORING & ANALYTICS
  // ========================================
  get monitoring() {
    return {
      sentry: {
        dsn: process.env.SENTRY_DSN
      },
      newRelic: {
        licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
        appName: process.env.NEW_RELIC_APP_NAME || 'DatingApp-Backend'
      }
    };
  }

  // ========================================
  // DEVELOPMENT TOOLS
  // ========================================
  get development() {
    return {
      debug: process.env.DEBUG || 'socket.io:*,app:*',
      nodemonIgnore: process.env.NODEMON_IGNORE || 'uploads/*,logs/*,node_modules/*',
      nodemonDelay: parseInt(process.env.NODEMON_DELAY) || 1000
    };
  }

  // ========================================
  // TESTING CONFIGURATION
  // ========================================
  get testing() {
    return {
      dbName: process.env.TEST_DB_NAME || 'dating_software_test',
      redisDb: parseInt(process.env.TEST_REDIS_DB) || 1,
      jestTimeout: parseInt(process.env.JEST_TIMEOUT) || 10000
    };
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================
  validateRequiredEnvVars() {
    const required = [
      'JWT_SECRET',
      'DB_PASSWORD'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('⚠️  Missing required environment variables:', missing);
      console.warn('Please check your .env file');
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  get all() {
    return {
      nodeEnv: this.NODE_ENV,
      port: this.PORT,
      host: this.HOST,
      database: this.database,
      jwt: this.jwt,
      redis: this.redis,
      socket: this.socket,
      firebase: this.firebase,
      email: this.email,
      upload: this.upload,
      security: this.security,
      logging: this.logging,
      cache: this.cache,
      message: this.message,
      match: this.match,
      frontend: this.frontend,
      services: this.services,
      monitoring: this.monitoring,
      development: this.development,
      testing: this.testing
    };
  }

  // Get environment summary for logging
  get summary() {
    return {
      environment: this.NODE_ENV,
      port: this.PORT,
      host: this.HOST,
      database: `${this.database.host}:${this.database.port}/${this.database.name}`,
      redis: `${this.redis.host}:${this.redis.port}`,
      socket: this.socket.corsOrigin,
      frontend: this.frontend.url
    };
  }
}

// Export singleton instance
module.exports = new Environment(); 