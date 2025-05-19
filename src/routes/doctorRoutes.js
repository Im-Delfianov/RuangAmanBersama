const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', doctorController.addDoctor); // bisa dibatasi hanya admin
router.post('/:id/rate', authenticateToken, doctorController.rateDoctor);

module.exports = router;
