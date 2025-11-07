require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in environment variables');
  process.exit(1);
}
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth');
const filesRoutes = require('./routes/files');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CloudDrop backend is running 🚀');
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
