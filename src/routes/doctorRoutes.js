const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', authenticateToken, ifAdmin, doctorController.addDoctor);
router.post('/:id/rate', authenticateToken, doctorController.rateDoctor);
router.delete('/:id',authenticateToken, ifAdmin, doctorController.deleteDoctor);

module.exports = router;
