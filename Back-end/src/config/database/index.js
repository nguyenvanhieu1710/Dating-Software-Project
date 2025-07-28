const { Pool } = require("pg");
require("dotenv").config();

// Cấu hình connection pool cho PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "job_type_management",
  port: process.env.DB_PORT || 5432,
  max: 20, // Số lượng connection tối đa trong pool
  idleTimeoutMillis: 30000, // Thời gian timeout cho idle connections
  connectionTimeoutMillis: 2000, // Thời gian timeout cho việc tạo connection mới
});

// Test connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error connecting to PostgreSQL:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database successfully");
    console.log("📅 Current database time:", res.rows[0].now);
  }
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  pool.end(() => {
    console.log("🔄 Pool has ended");
    process.exit(0);
  });
});

module.exports = pool;
