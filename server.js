const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../a'))); // Serve frontend files

// Routes
app.use('/auth', authRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../a/index.html')); // Fallback to index.html
});

app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
