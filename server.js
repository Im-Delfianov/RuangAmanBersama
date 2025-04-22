const app = require('./app');
const pool = require('./src/config/database')

require('dotenv').config();

const port = process.env.PORT || 5000;

//mulai server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 🧩 Clean shutdown handler
async function shutdown() {
  console.log('Shutting down server...');

  // Tutup Express server
  server.close(() => {
    console.log('HTTP server closed');
  });

  // Tutup pool database
  await pool.end();
  console.log('Database pool closed');

  process.exit(0);
}

process.on('SIGINT', shutdown);
