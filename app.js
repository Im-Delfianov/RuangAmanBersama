const express = require('express');
const app = express();
const userRoutes = require('./src/routes/userRoutes')
const authRoutes = require('./src/routes/authRoutes')
const cors = require('cors');

//app.use
app.use(cors());
app.use(express.json());


//routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);





module.exports = app;