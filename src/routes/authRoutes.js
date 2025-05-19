const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController')

router.post('/register', authcontroller.registerUser);
router.post('/login', authcontroller.loginUser);
router.post('/logout', authcontroller.logout);
router.post('/resend-verification', authcontroller.resendVerificationEmail);


router.get('/refresh', authcontroller.refresh);
router.get('/verify-email', authcontroller.verifyEmail);




module.exports = router;