const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');
const { uploadAvatar } = require('../middlewares/multerMiddleware');


router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/ratings', doctorController.getDoctorRatings);
router.post('/', authenticateToken, ifAdmin, uploadAvatar.single('avatar'),doctorController.addDoctor);
router.post('/update/:id', authenticateToken, ifAdmin, doctorController.updateDoctor);
router.post('/:id/rate', authenticateToken, doctorController.rateDoctor);
router.delete('/:id',authenticateToken, ifAdmin, doctorController.deleteDoctor);

module.exports = router;
