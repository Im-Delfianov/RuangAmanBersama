const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController')


console.log('registerUser:', typeof authcontroller.registerUser);
console.log('loginUser:', typeof authcontroller.loginUser);
console.log('googleRegister:', typeof authcontroller.googleRegister);
console.log('googleLogin:', typeof authcontroller.googleLogin);
console.log('logout:', typeof authcontroller.logout);
console.log('resendVerificationEmail:', typeof authcontroller.resendVerificationEmail);
console.log('forgotPassword:', typeof authcontroller.forgotPassword);
console.log('resetPassword:', typeof authcontroller.resetPassword);
console.log('refresh:', typeof authcontroller.refresh);
console.log('verifyEmail:', typeof authcontroller.verifyEmail);

router.post('/register', authcontroller.registerUser);
router.post('/login', authcontroller.loginUser);
router.post('/register/google', authcontroller.googleRegister);
router.post('/login/google', authcontroller.googleLogin);
router.post('/logout', authcontroller.logout);
router.post('/resend-verification', authcontroller.resendVerificationEmail);
router.post('/forgot-password', authcontroller.forgotPassword);
router.post('/reset-password', authcontroller.resetPassword);



router.get('/refresh', authcontroller.refresh);
router.get('/verify-email', authcontroller.verifyEmail);





module.exports = router;