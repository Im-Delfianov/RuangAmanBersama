const doctorModel = require('../config/doctorModel');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.getAllDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dokter', error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorModel.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dokter', error: err.message });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const newDoctor = await doctorModel.addDoctor(req.body);
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan dokter', error: err.message });
  }
};

exports.rateDoctor = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    const user_id = req.user.id; 
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating harus antara 1 hingga 5' });
    }

    const rated = await doctorModel.rateDoctor({ user_id, doctor_id, rating, review });
    res.status(200).json(rated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memberi rating', error: err.message });
  }
};

exports.deleteDoctor = async (req,res) => {
  const id = req.params.id;

    try {
      await doctorModel.deleteDoctor(id);
      res.status(200).json({message: 'berhasil menghapus dokter'});
    } catch (error) {
      res.status(500).json({message: 'gagal menghapus dokter'});
    }
  
}
