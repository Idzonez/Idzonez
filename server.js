const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

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
    // Set Content-Type to JSON and return the token
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'Login successful', token });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Register Route
app.post('/api/auth/register', (req, res) => {
  const { UserName, Email, Password } = req.body;

  // Validate input
  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Simulate a successful sign-up
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({ message: 'User registered successfully!' });
});

// Protect a route with JWT
app.get('/protected', verifyToken, (req, res) => {
  jwt.verify(req.token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ message: 'Access granted to protected route', decoded });
  });
});

// Helper function to verify JWT token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  req.token = token;

  next();
}

// Payment Info Routes
app.get('/payment-info', (req, res) => {
  const paymentMethod = req.query.method || 'bitcoin';
  let paymentDetails = '';
  let handlingTime = '';

  if (paymentMethod === 'bitcoin') {
    paymentDetails = '<p>Payment Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>';
    handlingTime = '<p>Handling Time: 3-5 business days</p>';
  } else if (paymentMethod === 'cashApp') {
    paymentDetails = '<p>Cash App ID: $YourCashAppUsername</p>';
    handlingTime = '<p>Handling Time: 1-2 business days</p>';
  } else if (paymentMethod === 'ethereum') {
    paymentDetails = '<p>Payment Address: 0x32a5bf9cdb17b15422bb6bd926b4cf58b40db144</p>';
    handlingTime = '<p>Handling Time: 2-4 business days</p>';
  }

  // Return payment info in a plain HTML response (you might want to change this to JSON later)
  res.send(`
    <h1>Payment Information</h1>
    ${paymentDetails}
    ${handlingTime}
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' }); // Ensure JSON response on errors
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' }); // Ensure JSON response on 404
});

// Listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
