import express from 'express';
const router = express.Router();
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
dotenv.config();


const client = new Client({});

router.get('/geocode', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Geocoding failed', error: error.message });
  }
});

export default router;

