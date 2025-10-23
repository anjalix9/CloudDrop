const express = require('express');
const router = express.Router();

// Example login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add login logic here — for example:
    if (email === 'test@example.com' && password === '123456') {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Example register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Add registration logic here
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
