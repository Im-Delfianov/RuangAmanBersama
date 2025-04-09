const express = require('express');
const pool = require('./database.js');

const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.get('/users', async (req, res) => {
    await pool.query('select * from public.users', (err, result)=>{
        if(!err){
          res.send(result.rows);
        }

    })
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
