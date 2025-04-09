const {Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    port: 5432, // default Postgres port
    database: 'postgres'
});

module.exports = pool;


