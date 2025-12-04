// authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// 🔐 Middleware: Authenticate user (Protect routes)
// Protect middleware
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found, authorization failed');
      }

     

      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token invalid');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});


// 🎯 Role-based authorization middleware (multiple roles allowed)
// 🎯 Role-based authorization middleware (multiple roles allowed)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.trim().toLowerCase(); // Normalize user role
    const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase()); // Normalize allowed roles

   

    if (!req.user || !userRole) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    // Now compare normalized roles
    if (!normalizedAllowedRoles.includes(userRole)) {
      res.status(403).json({ message: `Access denied: requires role(s) ${allowedRoles.join(", ")}` });
      return;
    }

    next();
  };
};



// Export individual role-based middlewares
const admin = authorizeRoles('admin');
const client = authorizeRoles('client');
const unitManager = authorizeRoles('Unit Manager');

export { protect, authorizeRoles, admin, client, unitManager };
