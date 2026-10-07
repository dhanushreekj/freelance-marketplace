const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({ message: 'Freelance Marketplace API is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS skills FROM skills');
    res.json({ status: 'ok', skillsInDb: rows[0].skills });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = app;