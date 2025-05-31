const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');
const { uploadAvatar } = require('../middlewares/multerMiddleware');


router.get('/', authenticateToken, ifAdmin, userController.getAllUsers);
router.get('/:id',authenticateToken, userController.findUserById);
router.delete('/:id',authenticateToken, ifAdmin, userController.deleteUserbyId);
router.post('/update/:id', authenticateToken, userController.updateUser);
router.post('/update/:id/avatar', authenticateToken, uploadAvatar.single('avatar'), userController.updatePict)
router.post('/update/:id/role', authenticateToken, ifAdmin, userController.updateRole);

module.exports = router;