const cron = require('node-cron');
const pool = require('../config/database');
const dayjs = require('dayjs');


cron.schedule('0 * * * *', async () => {

  console.log("🕒 Running cron job at", new Date());
  try {
    const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
    const result = await pool.query(
      'DELETE FROM public.users WHERE is_verified = false AND created_at < $1',
      [oneHourAgo]
    );
    console.log(`🧹 Deleted ${result.rowCount} unverified user(s)`);
  } catch (err) {
    console.error('Failed to delete unverified users:', err.message);
  }
});
