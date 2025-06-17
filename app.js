const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes')
const forumRoutes = require('./src/routes/forumRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const appointRoutes = require('./src/routes/appointmentRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');
const cookieparser = require('cookie-parser');

require('./src/utils/cleanUpUnverified.js');
require('dotenv').config();

//app.use
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));
app.use(express.json());
app.use(cookieparser());


//routes

app.use('/auth', authRoutes);
app.use('/forums', forumRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointRoutes);
app.use('/users', userRoutes);





module.exports = app;