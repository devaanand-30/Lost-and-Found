// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware to protect private routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header is present
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token after 'Bearer '

      if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
      }

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.userId) {
        res.status(401);
        throw new Error('Not authorized, token invalid');
      }

      // Attach the user to the request object, excluding password
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);

      // Handle different types of errors
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Token expired, please login again');
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Token malformed or invalid');
      } else {
        res.status(401);
        throw new Error('Not authorized');
      }
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next(); // Proceed if the user is an admin
  } else {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }
};

export { protect, isAdmin };
