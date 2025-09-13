const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class ProfileModel extends BaseModel {
  constructor() {
    super("profiles", "user_id");
  }

  /**
   * Lấy profile theo user_id
   */
  async findByUserId(userId) {
    const sql = `
      SELECT p.*, u.email, u.phone_number, u.status as user_status
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Tạo profile mới
   */
  async createProfile(profileData) {
    const sql = `
      INSERT INTO profiles (
        user_id, first_name, dob, gender, bio, job_title, school, location, 
        popularity_score, last_active_at, is_verified
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        ST_SetSRID(ST_MakePoint($8::double precision, $9::double precision), 4326)::geometry,
        $10, $11, $12
      )
      RETURNING *
    `;
    
    const values = [
      profileData.user_id,
      profileData.first_name,
      profileData.dob,
      profileData.gender,
      profileData.bio || null,
      profileData.job_title || null,
      profileData.school || null,
      profileData.longitude || 0,
      profileData.latitude || 0,
      profileData.popularity_score || 0.0,
      profileData.last_active_at || new Date(),
      profileData.is_verified || false
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Cập nhật profile
   */
  async updateProfile(userId, profileData) {
    const sql = `
      UPDATE profiles 
      SET 
        first_name = COALESCE($2, first_name),
        dob = COALESCE($3, dob),
        gender = COALESCE($4, gender),
        bio = COALESCE($5, bio),
        job_title = COALESCE($6, job_title),
        school = COALESCE($7, school),
        location = CASE 
          WHEN $8::double precision IS NOT NULL AND $9::double precision IS NOT NULL 
          THEN ST_SetSRID(ST_MakePoint($8::double precision, $9::double precision), 4326)::geometry
          ELSE location
        END,
        popularity_score = COALESCE($10, popularity_score),
        last_active_at = COALESCE($11, last_active_at),
        is_verified = COALESCE($12, is_verified),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `;
    
    const values = [
      userId,
      profileData.first_name,
      profileData.dob,
      profileData.gender,
      profileData.bio,
      profileData.job_title,
      profileData.school,
      profileData.longitude,
      profileData.latitude,
      profileData.popularity_score,
      profileData.last_active_at,
      profileData.is_verified
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Tìm kiếm profiles theo tiêu chí
   */
  async searchProfiles(criteria) {
    const {
      minAge, maxAge, gender, preferredGender, maxDistance, 
      latitude, longitude, limit = 20, offset = 0
    } = criteria;

    let sql = `
      SELECT 
        p.*, u.email, u.phone_number, u.status as user_status,
        CASE 
          WHEN $1 IS NOT NULL AND $2 IS NOT NULL AND p.location IS NOT NULL
          THEN ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326))
          ELSE NULL
        END as distance_km
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.status = 'active' AND p.is_verified = true
    `;

    const params = [longitude, latitude];
    let paramIndex = 3;

    if (minAge) {
      sql += ` AND EXTRACT(YEAR FROM AGE(p.dob)) >= $${paramIndex}`;
      params.push(minAge);
      paramIndex++;
    }

    if (maxAge) {
      sql += ` AND EXTRACT(YEAR FROM AGE(p.dob)) <= $${paramIndex}`;
      params.push(maxAge);
      paramIndex++;
    }

    if (gender) {
      sql += ` AND p.gender = $${paramIndex}`;
      params.push(gender);
      paramIndex++;
    }

    if (preferredGender && preferredGender !== 'all') {
      sql += ` AND p.gender = $${paramIndex}`;
      params.push(preferredGender);
      paramIndex++;
    }

    if (maxDistance && latitude && longitude) {
      sql += ` AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $${paramIndex} * 1000)`;
      params.push(maxDistance);
      paramIndex++;
    }

    sql += ` ORDER BY p.popularity_score DESC, p.last_active_at DESC`;
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Cập nhật last_active_at
   */
  async updateLastActive(userId) {
    const sql = `
      UPDATE profiles 
      SET last_active_at = NOW() 
      WHERE user_id = $1
    `;
    return await DatabaseHelper.query(sql, [userId]);
  }

  /**
   * Tính toán popularity score
   */
  async calculatePopularityScore(userId) {
    const sql = `
      UPDATE profiles 
      SET popularity_score = (
        SELECT COALESCE(COUNT(DISTINCT s.swiper_user_id), 0) * 0.5 +
               COALESCE(COUNT(DISTINCT m.id), 0) * 2.0
        FROM profiles p
        LEFT JOIN swipes s ON p.user_id = s.swiped_user_id AND s.action = 'like'
        LEFT JOIN matches m ON (p.user_id = m.user1_id OR p.user_id = m.user2_id)
        WHERE p.user_id = $1
      )
      WHERE user_id = $1
      RETURNING popularity_score
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }
}

module.exports = ProfileModel; 