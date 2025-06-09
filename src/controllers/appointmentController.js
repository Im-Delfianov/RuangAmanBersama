const appointmentModel = require('../config/appointmentModel');
const { sendEmail } = require('../utils/sendEmailer');
const doctorModel = require('../config/doctorModel');
const userModels = require('../config/userModels');

exports.createAppointment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { doctor_id, hari, waktu, notes } = req.body;
    

    if (!doctor_id || !hari || !waktu) {
      return res.status(400).json({ message: 'Dokter dan waktu janji harus diisi' });
    }

    const doctor = await doctorModel.getDoctorById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    }

    const userData= await userModels.findUserById(user_id);
    if(!userData.phone_number) {return res.status(404).json({message: 'nomor telepon tidak ditemukan, silahkan isi nomor telepon terlebih dahulu'})}

    const newAppointment = await appointmentModel.createAppointment({ user_id, doctor_id, hari, waktu, notes });
    res.status(201).json(newAppointment);
    
  
    
    await sendEmail({
      to:userData.email,
      subject: 'Konfirmasi Janji Temu',
      html: `
        <h3>Halo ${userData.full_name},</h3>
        <p>Janji temu kamu dengan ${doctor.full_name} berhasil dibuat.</p>
        <p><strong>Hari:</strong> ${newAppointment.hari}</p>
        <p><strong>Waktu:</strong> ${newAppointment.waktu} WIB</p>
        <p>Admin akan mengirimi kamu pesan via Whatsapp untuk mengonfirmasi lebih lanjut. Silahkan cek email secara berkala untuk melihat status janji temu.</p>
        <br><p>Terima kasih</p>`
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

    const allowedStatus = ['Menunggu', 'Diterima', 'Dibatalkan', 'Selesai'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const updated = await appointmentModel.updateAppointmentStatus(id, status);
    if (!updated) return res.status(404).json({ message: 'Janji temu tidak ditemukan' });

    
    const userData = await userModels.findUserById(updated.user_id);

    await sendEmail({
      to: userData.email,
      subject: 'Update Status Janji Temu',
      html: `
        <h3>Status Janji Temu Diubah</h3>
        <p><strong>Hari:</strong> ${updated.hari}</p>
        <p><strong>Waktu:</strong> ${updated.waktu} WIB</p>
        <p>Status terbaru: <strong>${status}</strong></p>
        <br><p>Terima kasih telah mempercayakan Ruang Aman Bersama.</p>`
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status janji temu', error: err.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
          const allappointments = await appointmentModel.getAllAppointments();
          res.json(allappointments);
      } catch (err) {
          res.status(500).json({ message: 'Gagal mengambil data jadwal', error: err.message });
      }
};
