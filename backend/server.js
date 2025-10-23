const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth');

// Mount routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CloudDrop backend is running 🚀');
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
