// userRoutes.js
import express from 'express';
import {
  registerUser,
  authUser,
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', authUser);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
