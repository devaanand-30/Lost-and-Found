import express from 'express';
import { generatePdf } from '../services/pdfService.js';

const router = express.Router();

router.post('/generate', generatePdf);

export default router;