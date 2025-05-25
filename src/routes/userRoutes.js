const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:id',userController.findUserById);
router.delete('/:id',authenticateToken, ifAdmin, userController.deleteUserbyId);
router.post('/update/:id', authenticateToken, userController.updateUser);

module.exports = router;