require('dotenv').config();

const express = require('express');
const path = require('path');
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
app.use('/wwwroot', express.static(path.join(__dirname, '..', 'wwwroot')));

// Add a specific route for the admin dashboard
app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'UP' }); // Respond with a JSON object
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Route for the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/index.html'));
});

app.get('/order.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'order.html')); // Adjusted path to point to Views
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'about.html')); // Adjusted path to point to Views
});

app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'cart.html')); // Adjusted path to point to Views
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'admin.html')); // Adjusted path to point to Views
});

app.get('/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'checkout.html')); // Adjusted path to point to Views
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'login.html')); // Adjusted path to point to Views
});

app.get('/order-management.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'order-management.html')); // Adjusted path to point to Views
});

app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'payment.html')); // Adjusted path to point to Views
});

app.get('/product-management.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views', 'product-management.html')); // Adjusted path to point to Views
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/wwwroot', 'admin-dashboard.html')); // Adjusted path to point to wwwroot
});

app.get('/admin-login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/wwwroot', 'admin-login.html')); // Adjusted path to point to wwwroot
});

// Add rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Regular user login route
app.post('/api/auth/login', (req, res) => {
    console.log('Regular login attempt received:', req.body);
    const { username, password } = req.body;

    // Log the attempt
    console.log('Regular login attempt with username:', username);

    // For now, always return unsuccessful for regular login
    res.status(401).json({ 
        isValid: false, 
        message: 'Invalid credentials'
    });
});

// Admin login route
app.post('/api/auth/admin-login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded admin credentials for testing
    const adminUsername = 'admin';     // Hardcoded username
    const adminPassword = 'password';   // Hardcoded password

    // Only log when an actual login attempt is made
    console.log('Admin login attempt received with username:', username);
    
    // Check if the provided credentials match the admin credentials
    if (username === adminUsername && password === adminPassword) {
        console.log('Admin login successful');
        res.json({ 
            isValid: true, 
            message: 'Admin login successful', 
            redirectUrl: '/admin'
        });
    } else {
        console.log('Admin login failed - invalid credentials');
        res.status(401).json({ 
            isValid: false, 
            message: 'Invalid admin credentials' 
        });
    }
});

// Admin route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'admin-dashboard.html'));
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
