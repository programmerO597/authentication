const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Replace this with your database logic
const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'Student' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password456', role: 'Faculty' },
];

// Secret key for JWT (use environment variables in production)
const SECRET_KEY = 'your_secret_key';

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Add new user to "database"
        const newUser = { id: `${users.length + 1}`, name, email, password, role };
        users.push(newUser);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user in the "database"
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Token validation middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
};

// Protected route (example)
router.get('/dashboard', authenticateToken, (req, res) => {
    return res.status(200).json({ message: 'Welcome to the dashboard', role: req.user.role });
});

module.exports = router;
