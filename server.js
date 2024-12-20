const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file

// Set up CORS with specific origins for production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*', // Allow all origins in development, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "wwwroot" directory
app.use(express.static(path.join(__dirname, 'wwwroot')));

// Home route (hello world)
app.get('/', (req, res) => {
  res.send('Hello, welcome to IDZonez!');
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Replace with real user authentication logic
  const user = { username: 'admin', password: 'admin' }; // Hardcoded for demo purposes

  // Check if username and password match
  if (username === user.username && password === user.password) {
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'Login successful', token });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Register Route
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Simulate a successful sign-up
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({ message: 'User registered successfully!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on ${process.env.BASE_URL || 'http://localhost'}:${port}`);
});
