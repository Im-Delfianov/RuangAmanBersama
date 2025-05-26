const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/me', authenticateToken, appointmentController.getMyAppointments);
router.get('/', authenticateToken, ifAdmin, appointmentController.getAllAppointments);
router.get('/doctor/:id', authenticateToken, appointmentController.getDoctorAppointments);
router.patch('/:id/status', authenticateToken, appointmentController.updateAppointmentStatus);


module.exports = router;
