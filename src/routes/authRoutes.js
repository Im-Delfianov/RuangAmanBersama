const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController')

router.post('/register', authcontroller.registerUser);
router.post('/login', authcontroller.loginUser);
router.post('/logout', authcontroller.logout);


router.get('/refresh', authcontroller.refresh);


module.exports = router;