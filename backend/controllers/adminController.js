// backend/controllers/adminController.js

import Item from '../models/Item.js';

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('reportedBy', 'name email');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// Verify item
export const verifyItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: 'verified' }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item verified', item });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying item' });
  }
};

// Reject item
export const rejectItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item rejected', item });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting item' });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};
