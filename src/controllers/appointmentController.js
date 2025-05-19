const appointmentModel = require('../config/appointmentModel');

exports.createAppointment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { doctor_id, scheduled_time, notes } = req.body;

    if (!doctor_id || !scheduled_time) {
      return res.status(400).json({ message: 'Dokter dan waktu janji harus diisi' });
    }

    const newAppointment = await appointmentModel.createAppointment({ user_id, doctor_id, scheduled_time, notes });
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat janji temu', error: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = await appointmentModel.getAppointmentsByUser(user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil janji temu', error: err.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    const data = await appointmentModel.getAppointmentsByDoctor(doctor_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dokter', error: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatus = ['pending', 'confirmed', 'canceled', 'completed'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const updated = await appointmentModel.updateAppointmentStatus(id, status);
    if (!updated) return res.status(404).json({ message: 'Janji temu tidak ditemukan' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status janji temu', error: err.message });
  }
};
