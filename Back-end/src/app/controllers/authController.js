const BaseController = require("./BaseController");
const AuthModel = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController extends BaseController {
  constructor() {
      super(new AuthModel());
  }

  /**
   * User login
   */
  async login(req, res) {
    try {
      this.validateRequiredFields(req, ["email", "password"]);

      const { email, password } = req.body;

      const user = await this.model.findByEmailForLogin(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          status: user.status,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
            status: user.status,
          },
          token,
        },
        message: "Login successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to login");
    }
  }

  /**
   * User registration
   */
  async register(req, res) {
    try {
      this.validateRequiredFields(req, ["email", "password", "phone_number"]);

      const { email, password, phone_number } = req.body;

      // Check if user already exists
      const existingUser = await this.model.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      // console.log("Password hash:", password_hash);
      // return;
      
      // Create user
      const userData = {
        email,
        phone_number,
        password_hash,
        status: "unverified",
      };
      // console.log("User data:", userData);
      // Default Data
      const profileData = {
        first_name: email.split('@')[0],
        dob: "1990-01-01",
        gender: "male",
        bio: "Hello, I'm new to this app!",
        job_title: "Software Developer",
        company: "Tech Company",
        school: "University",
        education: "Bachelor's Degree",
        height_cm: 175,
        relationship_goals: "Looking for serious relationship",
        location: "POINT(106.660172 10.762622)",
        popularity_score: 0.0,
        last_active_at: new Date(),
        is_verified: false,
        is_online: true,
        last_seen: null
      }
      // console.log("Profile data:", profileData);
      // return;

      const user = await this.model.createWithProfile(userData, profileData);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          status: user.status,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
            status: user.status,
          },
          token,
        },
        message: "Registration successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to register");
    }
  }
}

module.exports = AuthController;
