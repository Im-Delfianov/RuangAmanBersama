const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/userController')

router.get('/', usercontroller.getAllUsers);

module.exports = router;


