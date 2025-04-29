// imageController.js
import path from 'path';
import fs from 'fs';

export const uploadImage = (req, res) => {
  try {
    const imagePath = path.join(__dirname, '../uploads', req.file.filename);
    res.status(200).json({ message: 'Image uploaded successfully', imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
};