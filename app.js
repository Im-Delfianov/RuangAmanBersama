const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes')
const forumRoutes = require('./src/routes/forumRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const appointRoutes = require('./src/routes/appointmentRoutes');
const cors = require('cors');
const cookieparser = require('cookie-parser');


//app.use
app.use(cors());
app.use(express.json());
app.use(cookieparser())


//routes

app.use('/auth', authRoutes);
app.use('/forums', forumRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointRoutes);





module.exports = app;