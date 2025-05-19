const appointmentModel = require('../config/appointmentModel');
const { sendEmail } = require('../utils/sendEmailer');

exports.createAppointment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { doctor_id, scheduled_time, notes } = req.body;

    if (!doctor_id || !scheduled_time) {
      return res.status(400).json({ message: 'Dokter dan waktu janji harus diisi' });
    }

    const doctor = await doctorModel.getDoctorById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    }

    const newAppointment = await appointmentModel.createAppointment({ user_id, doctor_id, scheduled_time, notes });
    res.status(201).json(newAppointment);

    
    await sendEmail({
      to: req.user.email,
      subject: 'Konfirmasi Janji Temu',
      html: `
        <h3>Halo ${req.user.full_name},</h3>
        <p>Janji temu kamu dengan Bapak/Ibu ${doctor.full_name} berhasil dibuat.</p>
        <p><strong>Waktu:</strong> ${new Date(scheduled_time).toLocaleString()}</p>
        <p>Kami akan konfirmasi sesegera mungkin.</p>
        <br><p>Terima kasih 🙏</p>`
    });

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

    await sendEmail({
      to: appointment.user_email,
      subject: 'Update Status Janji Temu',
      html: `
        <h3>Status Janji Temu Diubah</h3>
        <p>Waktu: ${new Date(appointment.scheduled_time).toLocaleString()}</p>
        <p>Status terbaru: <strong>${status}</strong></p>
        <br><p>Terima kasih telah menggunakan Ruang Aman Bersama.</p>`
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status janji temu', error: err.message });
  }
};
