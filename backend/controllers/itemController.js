import Item from '../models/Item.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Create a lost item entry
// @route   POST /api/items/lost
// @access  Private
export const createLostItem = async (req, res) => {
  const { name, description, location, dateLost } = req.body;
  try {
    const newItem = await Item.create({
      name,
      description,
      location,
      date: dateLost,
      type: 'lost',
      imageUrl: req.file?.filename,
      user: req.user._id,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating lost item' });
  }
};

// @desc    Create a found item and notify owner
// @route   POST /api/items/found
// @access  Private
export const createFoundItem = async (req, res) => {
  const { name, description, location, dateLost, ownerEmail } = req.body;
  try {
    const newItem = await Item.create({
      name,
      description,
      location,
      date: dateLost,
      type: 'found',
      imageUrl: req.file?.filename,
      user: req.user._id,
    });

    // Send email to the item's possible owner
    if (ownerEmail) {
      const link = `https://www.google.com/maps?q=${location}`;
      const subject = `Item Found: ${name}`;
      const message = `A user found an item that might belong to you.\n\nDescription: ${description}\nLocation: ${link}`;
      await sendEmail(ownerEmail, subject, message);
    }

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating found item' });
  }
};

// @desc    Get all lost and found items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item' });
  }
};
