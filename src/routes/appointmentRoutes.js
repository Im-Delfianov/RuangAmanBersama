const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/me', authenticateToken, appointmentController.getMyAppointments);
router.get('/', authenticateToken)
router.get('/doctor/:id', authenticateToken, appointmentController.getDoctorAppointments);
router.patch('/:id/status', authenticateToken, appointmentController.updateAppointmentStatus);


module.exports = router;
