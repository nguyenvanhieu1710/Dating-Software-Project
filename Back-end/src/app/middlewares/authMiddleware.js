const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    // console.log('Auth headers:', req.headers['authorization']);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', JSON.stringify(decoded, null, 2));
    // console.log('Request URL:', req.originalUrl);
    // console.log('Request method:', req.method);
    req.user = decoded;
    // console.log('Set req.user to:', JSON.stringify(req.user, null, 2));
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * Middleware to check if user is active
 */
const requireActiveUser = (req, res, next) => {
  if (req.user.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Account must be active to access this resource",
    });
  }
  next();
};

/**
 * Middleware to check if user is verified
 */
const requireVerifiedUser = (req, res, next) => {
  if (req.user.status === "unverified") {
    return res.status(403).json({
      success: false,
      message: "Account must be verified to access this resource",
    });
  }
  next();
};

/**
 * Middleware to check if user owns the resource
 */
const requireOwnership = (paramName = "userId") => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramName];
    
    if (req.user.userId.toString() !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireActiveUser,
  requireVerifiedUser,
  requireOwnership,
}; 