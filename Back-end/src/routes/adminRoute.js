const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const redis = require('../config/redis');
const { locationToPostGIS } = require('../utils/geocoding');

// Middleware để kiểm tra quyền admin (chỉ cho development)
const isDevelopment = process.env.NODE_ENV === 'development';

// ========================================
// USER MANAGEMENT
// ========================================

// Tạo user mới với password hashing và profile
router.post('/users', async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      phone_number,
      dob,
      gender,
      bio,
      job_title,
      school,
      location,
      status = 'active',
      is_verified = false,
      popularity_score = 0,
      message_count = 0,
      last_active_at
    } = req.body;

    // Validation
    if (!email || !password || !first_name || !dob) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: email, password, first_name, dob'
      });
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if phone number already exists (if provided)
    if (phone_number) {
      const existingPhone = await pool.query('SELECT id FROM users WHERE phone_number = $1', [phone_number]);
      if (existingPhone.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);

    // Create user and profile in transaction
    await pool.query('BEGIN');
    try {
      // Insert user
      const userSql = `
        INSERT INTO users (
          email, phone_number, password_hash, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, email, phone_number, status, created_at, updated_at
      `;
      const userValues = [email, phone_number || null, password_hash, status];
      const userResult = await pool.query(userSql, userValues);
      const userId = userResult.rows[0].id;

      // Convert location text to PostGIS format
      const locationPostGIS = locationToPostGIS(location);
      
      // Insert profile
      const profileSql = `
        INSERT INTO profiles (
          user_id, first_name, dob, gender, bio, job_title, school, location,
          is_verified, popularity_score, last_active_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
        ) RETURNING *
      `;
      const profileValues = [
        userId, first_name, dob, gender || null,
        bio || null, job_title || null, school || null, locationPostGIS,
        is_verified, popularity_score, last_active_at || new Date().toISOString()
      ];
      const profileResult = await pool.query(profileSql, profileValues);

      await pool.query('COMMIT');
      
      // Return successful response with both user and profile data
      res.status(201).json({
        success: true,
        data: {
          ...userResult.rows[0],
          ...profileResult.rows[0]
        },
        message: 'User created successfully with profile'
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Lấy tất cả users
router.get('/users', async (req, res) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;
    
    let query = `
      SELECT 
        u.id, u.email, u.phone_number, u.created_at, u.updated_at,
        p.first_name, p.gender, p.dob, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `;
    
    const params = [];
    
    if (search) {
      query += ` WHERE u.email ILIKE $1 OR p.first_name ILIKE $1`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    // Get total count for pagination
    const countQuery = search 
      ? `SELECT COUNT(*) FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.email ILIKE $1 OR p.first_name ILIKE $1`
      : 'SELECT COUNT(*) FROM users';
    const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    const totalUsers = parseInt(countResult.rows[0].count);
    
    const page = Math.floor(parseInt(offset) / parseInt(limit)) + 1;
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    
    res.json({
      success: true,
      users: result.rows,
      total: totalUsers,
      page: page,
      limit: parseInt(limit),
      total_pages: totalPages
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Lấy thống kê users
router.get('/users/stats', async (req, res) => {
  try {
    const stats = {};
    
    // Tổng số users
    const totalUsersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    stats.total_users = parseInt(totalUsersResult.rows[0].total);
    
    // Users đang hoạt động (active)
    const activeUsersResult = await pool.query("SELECT COUNT(*) as total FROM users WHERE status = 'active'");
    stats.active_users = parseInt(activeUsersResult.rows[0].total);
    
    // Users mới hôm nay
    const newUsersTodayResult = await pool.query("SELECT COUNT(*) as total FROM users WHERE created_at >= CURRENT_DATE");
    stats.new_users_today = parseInt(newUsersTodayResult.rows[0].total);
    
    // Users đã verify
    const verifiedUsersResult = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE is_verified = true");
    stats.verified_users = parseInt(verifiedUsersResult.rows[0].total);
    
    // Users premium (có subscription)
    const premiumUsersResult = await pool.query("SELECT COUNT(DISTINCT user_id) as total FROM subscriptions WHERE status = 'active'");
    stats.premium_users = parseInt(premiumUsersResult.rows[0].total);
    
    // Users bị banned
    const bannedUsersResult = await pool.query("SELECT COUNT(*) as total FROM users WHERE status = 'banned'");
    stats.banned_users = parseInt(bannedUsersResult.rows[0].total);
    
    // Tăng trưởng users
    const growthRateResult = await pool.query(`
      SELECT 
        COUNT(*) as new_users,
        (COUNT(*)::float / LAG(COUNT(*), 1, COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) - 1) * 100 as growth_rate
      FROM users 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months')
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) DESC
      LIMIT 1
    `);
    stats.growth_rate = growthRateResult.rows.length > 0 ? parseFloat(growthRateResult.rows[0].growth_rate).toFixed(2) : 0;
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
});

// Lấy user theo ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        u.*, p.*, s.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN settings s ON u.id = s.user_id
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// Cập nhật user theo ID
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      phone_number,
      status,
      first_name,
      dob,
      gender,
      bio,
      job_title,
      school,
      location,
      is_verified,
      popularity_score,
      last_active_at
    } = req.body;

    // Kiểm tra user có tồn tại không
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Kiểm tra email trùng lặp (nếu email được cập nhật)
    if (email) {
      const existingEmail = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
      if (existingEmail.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Kiểm tra phone number trùng lặp (nếu phone được cập nhật)
    if (phone_number) {
      const existingPhone = await pool.query('SELECT id FROM users WHERE phone_number = $1 AND id != $2', [phone_number, id]);
      if (existingPhone.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
    }

    // Bắt đầu transaction
    await pool.query('BEGIN');
    
    try {
      // Cập nhật bảng users
      const userUpdateFields = [];
      const userUpdateValues = [];
      let userParamIndex = 1;

      if (email !== undefined) {
        userUpdateFields.push(`email = $${userParamIndex++}`);
        userUpdateValues.push(email);
      }
      if (phone_number !== undefined) {
        userUpdateFields.push(`phone_number = $${userParamIndex++}`);
        userUpdateValues.push(phone_number);
      }
      if (status !== undefined) {
        userUpdateFields.push(`status = $${userParamIndex++}`);
        userUpdateValues.push(status);
      }
      
      userUpdateFields.push(`updated_at = NOW()`);
      userUpdateValues.push(id);

      if (userUpdateFields.length > 1) { // Có ít nhất 1 field để update (ngoài updated_at)
        const userUpdateSql = `
          UPDATE users 
          SET ${userUpdateFields.join(', ')}
          WHERE id = $${userParamIndex}
          RETURNING id, email, phone_number, status, created_at, updated_at
        `;
        await pool.query(userUpdateSql, userUpdateValues);
      }

      // Cập nhật bảng profiles
      const profileUpdateFields = [];
      const profileUpdateValues = [];
      let profileParamIndex = 1;

      if (first_name !== undefined) {
        profileUpdateFields.push(`first_name = $${profileParamIndex++}`);
        profileUpdateValues.push(first_name);
      }
      if (dob !== undefined) {
        profileUpdateFields.push(`dob = $${profileParamIndex++}`);
        profileUpdateValues.push(dob);
      }
      if (gender !== undefined) {
        profileUpdateFields.push(`gender = $${profileParamIndex++}`);
        profileUpdateValues.push(gender);
      }
      if (bio !== undefined) {
        profileUpdateFields.push(`bio = $${profileParamIndex++}`);
        profileUpdateValues.push(bio);
      }
      if (job_title !== undefined) {
        profileUpdateFields.push(`job_title = $${profileParamIndex++}`);
        profileUpdateValues.push(job_title);
      }
      if (school !== undefined) {
        profileUpdateFields.push(`school = $${profileParamIndex++}`);
        profileUpdateValues.push(school);
      }
      if (location !== undefined) {
        const locationPostGIS = locationToPostGIS(location);
        profileUpdateFields.push(`location = $${profileParamIndex++}`);
        profileUpdateValues.push(locationPostGIS);
      }
      if (is_verified !== undefined) {
        profileUpdateFields.push(`is_verified = $${profileParamIndex++}`);
        profileUpdateValues.push(is_verified);
      }
      if (popularity_score !== undefined) {
        profileUpdateFields.push(`popularity_score = $${profileParamIndex++}`);
        profileUpdateValues.push(popularity_score);
      }
      if (last_active_at !== undefined) {
        profileUpdateFields.push(`last_active_at = $${profileParamIndex++}`);
        profileUpdateValues.push(last_active_at);
      }

      profileUpdateFields.push(`updated_at = NOW()`);
      profileUpdateValues.push(id);

      if (profileUpdateFields.length > 1) { // Có ít nhất 1 field để update (ngoài updated_at)
        const profileUpdateSql = `
          UPDATE profiles 
          SET ${profileUpdateFields.join(', ')}
          WHERE user_id = $${profileParamIndex}
          RETURNING *
        `;
        await pool.query(profileUpdateSql, profileUpdateValues);
      }

      // Lấy dữ liệu user đã cập nhật
      const updatedUserQuery = `
        SELECT 
          u.id, u.email, u.phone_number, u.status, u.created_at, u.updated_at,
          p.first_name, p.dob, p.gender, p.bio, p.job_title, p.school, p.location,
          p.is_verified, p.popularity_score, p.last_active_at
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.id = $1
      `;
      const updatedUserResult = await pool.query(updatedUserQuery, [id]);

      await pool.query('COMMIT');

      res.json({
        success: true,
        data: updatedUserResult.rows[0],
        message: 'User updated successfully'
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// ========================================
// PROFILE MANAGEMENT
// ========================================

// Lấy tất cả profiles
router.get('/profiles', async (req, res) => {
  try {
    const { limit = 20, offset = 0, gender, min_age, max_age } = req.query;
    
    let query = `
      SELECT 
        p.*, u.email, u.phone_number
      FROM profiles p
      JOIN users u ON p.user_id = u.id
    `;
    
    const params = [];
    let whereConditions = [];
    
    if (gender) {
      whereConditions.push(`p.gender = $${params.length + 1}`);
      params.push(gender);
    }
    
    if (min_age || max_age) {
      const currentDate = new Date();
      if (min_age) {
        const maxDate = new Date(currentDate.getFullYear() - min_age, currentDate.getMonth(), currentDate.getDate());
        whereConditions.push(`p.date_of_birth <= $${params.length + 1}`);
        params.push(maxDate);
      }
      if (max_age) {
        const minDate = new Date(currentDate.getFullYear() - max_age - 1, currentDate.getMonth(), currentDate.getDate());
        whereConditions.push(`p.date_of_birth > $${params.length + 1}`);
        params.push(minDate);
      }
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles',
      error: error.message
    });
  }
});

// Lấy profile theo ID
router.get('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.*, u.email, u.phone_number
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// ========================================
// SWIPE MANAGEMENT
// ========================================

// Lấy tất cả swipes
router.get('/swipes', async (req, res) => {
  try {
    const { limit = 20, offset = 0, action } = req.query;
    
    let query = `
      SELECT 
        s.*, 
        swiper.email as swiper_email,
        swiped.email as swiped_email
      FROM swipes s
      JOIN users swiper ON s.swiper_user_id = swiper.id
      JOIN users swiped ON s.swiped_user_id = swiped.id
    `;
    
    const params = [];
    
    if (action) {
      query += ` WHERE s.action = $1`;
      params.push(action);
    }
    
    query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching swipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch swipes',
      error: error.message
    });
  }
});

// ========================================
// MATCH MANAGEMENT
// ========================================

// Lấy tất cả matches
router.get('/matches', async (req, res) => {
  try {
    const { limit = 20, offset = 0, status } = req.query;
    
    let query = `
      SELECT 
        m.*, 
        u1.email as user1_email,
        u2.email as user2_email
      FROM matches m
      JOIN users u1 ON m.user1_id = u1.id
      JOIN users u2 ON m.user2_id = u2.id
    `;
    
    const params = [];
    
    if (status) {
      query += ` WHERE m.status = $1`;
      params.push(status);
    }
    
    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch matches',
      error: error.message
    });
  }
});

// ========================================
// MESSAGE MANAGEMENT
// ========================================

// Lấy tất cả messages
router.get('/messages', async (req, res) => {
  try {
    const { limit = 20, offset = 0, match_id } = req.query;
    
    let query = `
      SELECT 
        msg.*, 
        u.email as sender_email,
        m.user1_id, m.user2_id
      FROM messages msg
      JOIN users u ON msg.sender_id = u.id
      JOIN matches m ON msg.match_id = m.id
    `;
    
    const params = [];
    
    if (match_id) {
      query += ` WHERE msg.match_id = $1`;
      params.push(match_id);
    }
    
    query += ` ORDER BY msg.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// ========================================
// STATISTICS
// ========================================

// Lấy thống kê tổng quan
router.get('/statistics', async (req, res) => {
  try {
    const stats = {};
    
    // Tổng số users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    stats.totalUsers = parseInt(usersResult.rows[0].total);
    
    // Tổng số profiles
    const profilesResult = await pool.query('SELECT COUNT(*) as total FROM profiles');
    stats.totalProfiles = parseInt(profilesResult.rows[0].total);
    
    // Tổng số swipes
    const swipesResult = await pool.query('SELECT COUNT(*) as total FROM swipes');
    stats.totalSwipes = parseInt(swipesResult.rows[0].total);
    
    // Tổng số matches
    const matchesResult = await pool.query('SELECT COUNT(*) as total FROM matches');
    stats.totalMatches = parseInt(matchesResult.rows[0].total);
    
    // Tổng số messages
    const messagesResult = await pool.query('SELECT COUNT(*) as total FROM messages');
    stats.totalMessages = parseInt(messagesResult.rows[0].total);
    
    // Swipes theo action
    const swipesByAction = await pool.query(`
      SELECT action, COUNT(*) as count 
      FROM swipes 
      GROUP BY action
    `);
    stats.swipesByAction = swipesByAction.rows;
    
    // Users theo tháng
    const usersByMonth = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM users 
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 12
    `);
    stats.usersByMonth = usersByMonth.rows;
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// ========================================
// SYSTEM LOGS
// ========================================

// Lấy logs hệ thống (giả lập)
router.get('/logs', async (req, res) => {
  try {
    const { limit = 20, offset = 0, level } = req.query;
    
    // Giả lập logs vì chưa có hệ thống logging thực
    const mockLogs = [
      {
        id: 1,
        level: 'info',
        message: 'Server started successfully',
        timestamp: new Date().toISOString(),
        user_id: null
      },
      {
        id: 2,
        level: 'info',
        message: 'User registered: test@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user_id: 1
      },
      {
        id: 3,
        level: 'warning',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        user_id: null
      }
    ];
    
    let filteredLogs = mockLogs;
    if (level) {
      filteredLogs = mockLogs.filter(log => log.level === level);
    }
    
    const paginatedLogs = filteredLogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: filteredLogs.length
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: error.message
    });
  }
});

// ========================================
// REDIS DATA
// ========================================

// Lấy dữ liệu Redis
router.get('/redis', async (req, res) => {
  try {
    const { key } = req.query;
    
    if (key) {
      // Lấy value của key cụ thể
      const value = await redis.get(key);
      res.json({
        success: true,
        data: {
          key,
          value: value ? JSON.parse(value) : null,
          type: 'string'
        }
      });
    } else {
      // Lấy tất cả keys
      const keys = await redis.keys('*');
      const data = {};
      
      for (const k of keys.slice(0, 20)) { // Giới hạn 20 keys
        const value = await redis.get(k);
        data[k] = value ? JSON.parse(value) : null;
      }
      
      res.json({
        success: true,
        data: {
          keys: keys.slice(0, 20),
          values: data,
          totalKeys: keys.length
        }
      });
    }
  } catch (error) {
    console.error('Error fetching Redis data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Redis data',
      error: error.message
    });
  }
});

// ========================================
// DATABASE SCHEMA
// ========================================

// Lấy cấu trúc database
router.get('/schema', async (req, res) => {
  try {
    const tables = [
      'users', 'profiles', 'settings', 'swipes', 'matches', 
      'messages', 'photos', 'subscriptions', 'consumables'
    ];
    
    const schema = {};
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [table]);
      
      schema[table] = result.rows;
    }
    
    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schema',
      error: error.message
    });
  }
});

// ========================================
// CUSTOM QUERY (CHỈ CHO DEVELOPMENT)
// ========================================

// Chạy query tùy chỉnh
router.post('/query', async (req, res) => {
  if (!isDevelopment) {
    return res.status(403).json({
      success: false,
      message: 'Custom queries are only allowed in development mode'
    });
  }
  
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    // Chỉ cho phép SELECT queries
    if (!query.trim().toLowerCase().startsWith('select')) {
      return res.status(400).json({
        success: false,
        message: 'Only SELECT queries are allowed'
      });
    }
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Error executing custom query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute query',
      error: error.message
    });
  }
});

module.exports = router;
