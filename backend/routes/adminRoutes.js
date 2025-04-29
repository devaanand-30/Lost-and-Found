import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  getAllItems,
  verifyItem,
  rejectItem,
  deleteItem,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost' });
    const foundItems = await Item.countDocuments({ type: 'found' });
    res.json({ usersCount, lostItems, foundItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Item Management
router.get('/items', protect, isAdmin, getAllItems);
router.put("/verify/:id", protect, isAdmin, verifyItem);
router.put("/reject/:id", protect, isAdmin, rejectItem);
router.delete("/:id", protect, isAdmin, deleteItem);

export default router;
