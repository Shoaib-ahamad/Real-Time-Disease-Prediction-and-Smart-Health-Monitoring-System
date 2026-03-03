const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth Middleware - Headers:', req.headers.authorization);

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];
      console.log('✅ Token extracted:', token.substring(0, 20) + '...');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified. User ID:', decoded.id);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({ message: "User not found" });
      }
      
      console.log('✅ User attached to request:', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log('❌ No Bearer token in Authorization header');
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };