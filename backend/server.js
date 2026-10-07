require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const pool = require('./src/config/db');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('MySQL connected to', process.env.DB_NAME);
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
});