require('dotenv').config();

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');

// Add this to check if env variables are loaded
console.log('Admin Username:', process.env.ADMIN_USERNAME);
console.log('Admin Password:', process.env.ADMIN_PASSWORD);

// Middleware
app.use(cors({
  origin: [
    'https://idzonez.com',
    'https://www.idzonez.com',
    'http://localhost:3000' // keep for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));
app.use('/views', express.static(path.join(__dirname, '..', 'Views')));

// Serve static files
app.use(express.static(__dirname));
app.use('/wwwroot', express.static(path.join(__dirname, '..', 'wwwroot')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/about.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/cart.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/checkout.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/login.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/order-management.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/order.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/payment.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/product-management.html'));
});

// Add a specific route for the admin dashboard
app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'wwwroot/error.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'wwwroot/admin-dashboard.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'wwwroot/admin-login.html'));
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'UP' }); // Respond with a JSON object
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Add rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});


// Route for the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views/index.html'));
});

// Login Route
app.post('/api/auth/login', limiter, (req, res) => {
  console.log('Login attempt received:', req.body);
  const { username, password } = req.body;
  
  // Add these console logs for debugging
  console.log('Attempting login with:', { username, password });
  console.log('Expected credentials:', { 
    username: process.env.ADMIN_USERNAME, 
    password: process.env.ADMIN_PASSWORD 
  });

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  console.log('Login attempt:', { 
    provided: { username, password },
    expected: { adminUsername, adminPassword }
  });

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign(
      { username: adminUsername },
      process.env.JWT_SECRET || 'Camreem04!..',
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin validation route
app.post('/api/auth/validate-admin', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ isValid: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the same secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Camreem04!..');
    
    // Check if the user matches the admin username from .env
    if (decoded.username === process.env.ADMIN_USERNAME) {
      res.json({ isValid: true });
    } else {
      res.status(403).json({ isValid: false, message: 'Not authorized as admin' });
    }
  } catch (err) {
    res.status(401).json({ isValid: false, message: 'Invalid token' });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Add 404 handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});

// Add security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
