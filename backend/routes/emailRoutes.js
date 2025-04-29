import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    await sendEmail(to, subject, message);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Email failed', error: error.message });
  }
});

export default router;