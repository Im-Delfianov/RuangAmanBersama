const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes')
const cors = require('cors');
const cookieparser = require('cookie-parser');


//app.use
app.use(cors());
app.use(express.json());
app.use(cookieparser())


//routes

app.use('/auth', authRoutes);





module.exports = app;