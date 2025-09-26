const express = require('express');
const router = express.Router();

const AdminRedisContronller = require('../app/controllers/admin/adminRedisController');

// Middleware để kiểm tra quyền admin (chỉ cho development)
const isDevelopment = process.env.NODE_ENV === 'development';

// Middleware kiểm tra quyền admin
const adminAuth = (req, res, next) => {
  if (isDevelopment) {
    return next();
  }
  
  // Ở môi trường production, kiểm tra token hoặc session admin
  // Đoạn code này sẽ được thêm sau khi triển khai xác thực
  next();
};

// ========================================
// REDIS DATA
// ========================================
router.get('/redis', adminAuth, AdminRedisContronller.getRedis);

module.exports = router;
