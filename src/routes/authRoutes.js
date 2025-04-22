const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController')

router.get('/', authController.handleLogin);
router.post('/register', authController.register);

module.exports = router;