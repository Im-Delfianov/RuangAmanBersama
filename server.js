const app = require('./app');
const pool = require('./src/config/database')

require('dotenv').config();



const port = process.env.PORT || 5000;

(async () => {
  try {
    console.log('🔌 Testing DB connection...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    client.release();

    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });

    // Shutdown logic
    async function shutdown() {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('HTTP server closed');
      });

      try {
        await pool.end();
        console.log('Database pool closed');
      } catch (err) {
        console.error('Error closing pool:', err);
      }

      process.exit(0);
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection:', reason);
    });

  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  }
})();
