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
    const users = await User.find().select('-password'); // Exclude password from response
    res.status(200).json(users); // Return users' basic info, without sensitive data
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile (Authenticated User)
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Get user info without password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Return user profile data
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile (Admin only)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json(user); // Return updated user data
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
