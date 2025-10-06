const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class ProfileModel extends BaseModel {
  constructor() {
    super("profiles", "user_id");
  }

  /**
   * Lấy profile theo user_id (đầy đủ trường user + profile)
   */
  async findByUserId(userId) {
    const sql = `
    SELECT 
      u.id AS user_id,
      u.email,
      u.phone_number,
      u.status AS user_status,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at,

      p.first_name,
      p.dob,
      p.gender,
      p.bio,
      p.job_title,
      p.company,
      p.school,
      p.education,
      p.height_cm,
      p.relationship_goals,
      ST_X(p.location::geometry) AS longitude,
      ST_Y(p.location::geometry) AS latitude,
      p.popularity_score,
      p.message_count,
      p.last_active_at,
      p.is_verified,
      p.is_online,
      p.last_seen,
      p.created_at AS profile_created_at,
      p.updated_at AS profile_updated_at
    FROM profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
  `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  // /**
  //  * Tạo profile mới
  //  */
  // async createProfile(profileData) {
  //   const sql = `
  //     INSERT INTO profiles (
  //       user_id, first_name, dob, gender, bio, job_title, company, school, education, height_cm, relationship_goals,
  //       location, popularity_score, last_active_at, is_verified, is_online, last_seen
  //     ) VALUES (
  //       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
  //       ST_SetSRID(ST_MakePoint($12::double precision, $13::double precision), 4326)::geometry,
  //       $14, $15, $16, $17, $18
  //     )
  //     RETURNING *
  //   `;

  //   const values = [
  //     profileData.user_id,
  //     profileData.first_name,
  //     profileData.dob,
  //     profileData.gender,
  //     profileData.bio || null,
  //     profileData.job_title || null,
  //     profileData.company || null,
  //     profileData.school || null,
  //     profileData.education || null,
  //     profileData.height_cm || null,
  //     profileData.relationship_goals || null,
  //     profileData.longitude || 0,
  //     profileData.latitude || 0,
  //     profileData.popularity_score || 0.0,
  //     profileData.last_active_at || new Date(),
  //     profileData.is_verified || false,
  //     profileData.is_online || false,
  //     profileData.last_seen || null
  //   ];

  //   return await DatabaseHelper.getOne(sql, values);
  // }

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
        company = COALESCE($7, company),
        school = COALESCE($8, school),
        education = COALESCE($9, education),
        height_cm = COALESCE($10, height_cm),
        relationship_goals = COALESCE($11, relationship_goals),
        location = CASE 
          WHEN $12::double precision IS NOT NULL AND $13::double precision IS NOT NULL 
          THEN ST_SetSRID(ST_MakePoint($8::double precision, $9::double precision), 4326)::geometry
          ELSE location
        END,
        popularity_score = COALESCE($14, popularity_score),
        last_active_at = COALESCE($15, last_active_at),
        is_verified = COALESCE($16, is_verified),
        is_online = COALESCE($17, is_online),
        last_seen = COALESCE($18, last_seen),
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
      profileData.company,
      profileData.school,
      profileData.education,
      profileData.height_cm,
      profileData.relationship_goals,
      profileData.longitude,
      profileData.latitude,
      profileData.popularity_score,
      profileData.last_active_at,
      profileData.is_verified,
      profileData.is_online,
      profileData.last_seen,
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Tìm kiếm profiles theo tiêu chí
   */
  async searchProfiles(criteria) {
    const {
      minAge,
      maxAge,
      gender,
      preferredGender,
      maxDistance,
      latitude,
      longitude,
      limit = 20,
      offset = 0,
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

    if (preferredGender && preferredGender !== "all") {
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
}

module.exports = ProfileModel;
