import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js'; // Import userRoutes for login
import imageRoutes from './routes/imageRoutes.js';
import locationRoutes from './routes/location.js';
import emailRoutes from './routes/emailRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // 👈 Use this instead of app.listen
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend origin
    methods: ['GET', 'POST']
  }
});

// Real-time connection
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
connectDB();

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Ensure this is mapped correctly
app.use('/api/images', imageRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Start the server with Socket.IO support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
