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
  const { full_name, specialization, bio, email, phone_number, avatar_url, location, available_days } = doctorData;
  const result = await pool.query(
    `INSERT INTO doctors (full_name, specialization, bio, email, phone_number, avatar_url, location, available_days)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [full_name, specialization, bio, email, phone_number, avatar_url, location, available_days]
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