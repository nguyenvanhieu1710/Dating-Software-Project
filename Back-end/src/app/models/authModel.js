const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class AuthModel extends BaseModel {
  constructor() {
    super("users", "id");
  }

  /**
   * Lấy user theo email cho login (bao gồm password_hash)
   */
  async findByEmailForLogin(email) {
    const sql = `
            SELECT u.id, u.email, u.phone_number, u.password_hash, u.status, u.created_at, u.updated_at
            FROM users u
            WHERE u.email = $1
        `;
    return await DatabaseHelper.getOne(sql, [email]);
  }

  /**
   * Lấy user theo email (không bao gồm password_hash)
   */
  async findByEmail(email) {
    const sql = `
            SELECT u.id, u.email, u.phone_number, u.status, u.created_at, u.updated_at, p.*
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.email = $1
        `;
    return await DatabaseHelper.getOne(sql, [email]);
  }

  /**
   * Tạo user với profile
   */
  async createWithProfile(userData, profileData) {
    return await DatabaseHelper.transaction(async (client) => {      
      const allowedAuthFields = ["email", "phone_number", "password_hash", "status"];
      const userColumns = Object.keys(userData).filter((key) => allowedAuthFields.includes(key));
      const userValues = userColumns.map((key) => userData[key]);
      const userPlaceholders = userValues
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const userSql = `
                INSERT INTO users (${userColumns.join(", ")})
                VALUES (${userPlaceholders})
                RETURNING *
            `;
      console.log("User SQL:", userSql);
      console.log("User values:", userValues);
    //   return;
      const user = await client.query(userSql, userValues);

      // Tạo profile
      if (Object.keys(profileData).length > 0) {
        const profileColumns = Object.keys(profileData);
        const profileValues = Object.values(profileData);
        const profilePlaceholders = profileValues
          .map((_, index) => `$${index + 1}`)
          .join(", ");

        const profileSql = `
                    INSERT INTO profiles (user_id, ${profileColumns.join(", ")})
                    VALUES ($${profileValues.length + 1}, ${profilePlaceholders})
                    RETURNING *
                `;
        console.log("Profile SQL:", profileSql);
        console.log("Profile values:", profileValues);
        // return;
        await client.query(profileSql, [...profileValues, user.rows[0].id]);
      }

      return user.rows[0];
    });
  }
}

module.exports = AuthModel;
