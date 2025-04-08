const express = require('express');
const pool = require('./database.js');

const app = express();

pool.connect();
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.get('/users', (req, res) => {
    pool.query('select * from public.users', (err, result)=>{
        if(!err){
          res.send(result.rows);
        }
        pool.end;
    })
});

