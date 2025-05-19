const cron = require('node-cron');
const pool = require('../config/database');


cron.schedule('0 * * * *', async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 jam yang lalu
    const result = await pool.query(
      'DELETE FROM users WHERE is_verified = false AND created_at < $1',
      [oneHourAgo]
    );
    console.log(`🧹 Deleted ${result.rowCount} unverified user(s)`);
  } catch (err) {
    console.error('Failed to delete unverified users:', err.message);
  }
});
