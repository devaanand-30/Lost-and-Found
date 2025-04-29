import express from 'express';
import upload from '../middleware/upload.js';
import { createLostItem, createFoundItem, getItems, getItemById } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/lost', protect, upload.single('image'), createLostItem);
router.post('/found', protect, upload.single('image'), createFoundItem);
router.get('/', getItems);
router.get('/:id', getItemById);

export default router;
