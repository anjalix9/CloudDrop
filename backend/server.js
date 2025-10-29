const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Health route
app.get('/', (req, res) => {
  res.send('CloudDrop backend is running 🚀');
});

// Connect to DB then start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clouddrop';
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
