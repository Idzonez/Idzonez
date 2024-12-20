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
  res.send('Hello, World!');
});

// Login Route (send JWT as cookie)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Replace with real user authentication logic
  const user = { username: 'admin', password: 'admin' }; // Hardcoded for demo purposes

  // Check if username and password match
  if (username === user.username && password === user.password) {
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin page (protected route)
app.get('/admin', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the Admin page!' });
});

// Helper function to verify JWT token (from Authorization header)
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const bearer = bearerHeader.split(' ');
  const token = bearer[1];

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded; // Attach decoded user info to request
    next();
  });
}

// Listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
