const pool = require('./database'); 

exports.getAllDoctors = async () => {
  const result = await pool.query('SELECT * FROM doctors ORDER BY full_name');
  return result.rows;
};

exports.deleteDoctor = async (doctorId) => {
  await pool.query('DELETE FROM doctors WHERE doctor_id= $1', [doctorId])
}

exports.getDoctorById = async (doctorId) => {
  const result = await pool.query('SELECT * FROM doctors WHERE doctor_id = $1', [doctorId]);
  return result.rows[0];
};

exports.addDoctor = async (doctorData) => {
  const { full_name, specialization, bio, email, phone_number, location, hari, waktu, avatar_url } = doctorData;
  const result = await pool.query(
    `INSERT INTO doctors (full_name, specialization, bio, email, phone_number,  location, hari, waktu, avatar_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [full_name, specialization, bio, email, phone_number, location, hari, waktu, avatar_url]
  );
  return result.rows[0];
};

exports.rateDoctor = async ({ user_id, doctor_id, rating, review }) => {
  const result = await pool.query(
    `INSERT INTO doctor_ratings (user_id, doctor_id, rating, review)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, doctor_id) DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review
     RETURNING *`,
    [user_id, doctor_id, rating, review]
  );
  return result.rows[0];
};

exports.getDoctorRatings = async (doctor_id) => {
  const result = await pool.query(
    `SELECT 
      d.full_name AS doctor_name,
      u.username AS username,
      r.rating,
      r.review
     FROM doctor_ratings r
     JOIN doctors d ON r.doctor_id = d.doctor_id
     JOIN users u ON r.user_id = u.user_id
     WHERE r.doctor_id = $1
     ORDER BY r.rating DESC`,
    [doctor_id]
  );

  return result.rows;
};

exports.hasAppointment = async (user_id, doctor_id) => {
  const result = await pool.query(
    `SELECT 1 FROM appointments 
     WHERE user_id = $1 AND doctor_id = $2 LIMIT 1`,
    [user_id, doctor_id]
  );
  return result.rowCount > 0;
};


exports.updateDoctor = async(doctor_id, full_nameBaru, specializationBaru, bioBaru, emailBaru, phoneBaru, locationBaru, hariBaru, waktuBaru, avatarBaru) => {
  const result = await pool.query (
    `UPDATE doctors 
    SET full_name = $2, specialization = $3, bio = $4, email = $5, phone_number = $6, location = $7, hari = $8, waktu = $9
    WHERE doctor_id = $1`, 
    [doctor_id, full_nameBaru, specializationBaru, bioBaru, emailBaru, phoneBaru, locationBaru, hariBaru, waktuBaru]
  )
  return result.rows[0];
}

exports.hasRated = async (user_id, doctor_id) => {
  const result = await pool.query(
    'SELECT 1 FROM doctor_ratings WHERE user_id = $1 AND doctor_id = $2 LIMIT 1',
    [user_id, doctor_id]
  );
  return result.rowCount > 0;
}