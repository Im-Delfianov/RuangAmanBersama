const doctorModel = require('../config/doctorModel');
const supabase = require('../config/supabaseClient');
const default_avatar = 'https://prmmqhuezcybgdsnxexr.supabase.co/storage/v1/object/public/images/avatar/default-avatar/avatar-default.png';

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
    const dataDokter = req.body;
    let avatar_url = default_avatar;

    if (req.file) {
      const file = req.file;
      const ext = file.originalname.split('.').pop();
      const fileName = `avatar/dokter-avatar/${dataDokter.full_name}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        return res.status(500).json({ message: 'Upload ke Supabase gagal', detail: uploadError.message });
      }

      const { data: publicData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      avatar_url = publicData.publicUrl;
    }

    const newDoctor = await doctorModel.addDoctor({...dataDokter, avatar_url});
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

     const hasAppointment = await doctorModel.hasAppointment(user_id, doctor_id);
    if (!hasAppointment) {
      return res.status(403).json({ message: 'Kamu belum pernah membuat janji dengan dokter ini' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating harus antara 1 hingga 5' });
    }

    const rated = await doctorModel.rateDoctor({ user_id, doctor_id, rating, review });
    res.status(200).json(rated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memberi rating', error: err.message });
  }
};

exports.getDoctorRatings = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    const ratings = await doctorModel.getDoctorRatings(doctor_id);
    res.status(200).json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data rating dokter' });
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

exports.updateDoctor = async(req, res) => {
  const doctor_id = req.params.id;
    const { full_name,
      specialization,
      bio,
      email,
      phone_number,
      location,
      hari,
      waktu,
      avatar_url } = req.body;
  
    try {
      const existingDoctor = await doctorModel.getDoctorById(doctor_id);
      if (!existingDoctor) {
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }
  
      const full_nameBaru = full_name ?? existingDoctor.full_name;
      const specializationBaru = specialization ?? existingDoctor.specialization;
      const bioBaru = bio ?? existingDoctor.bio;
      const emailBaru = email ?? existingDoctor.email;
      const phoneBaru = phone_number ?? existingDoctor.phone_number;
      const locationBaru = location ?? existingDoctor.location;
      const hariBaru = hari ?? existingDoctor.hari;
      const waktuBaru = waktu ?? existingDoctor.waktu;
      const avatarBaru = avatar_url ?? existingDoctor.avatar_url;
  
      await doctorModel.updateDoctor(doctor_id, full_nameBaru, specializationBaru, bioBaru, emailBaru, phoneBaru, locationBaru, hariBaru, waktuBaru, avatarBaru);
  
      res.json({ message: 'Data Dokter berhasil diperbarui' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
