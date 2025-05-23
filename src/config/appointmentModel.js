const db = require('./database');

exports.createAppointment = async ({ user_id, doctor_id, scheduled_time, notes }) => {
  const result = await db.query(
    `INSERT INTO appointments (user_id, doctor_id, appointment_time, notes)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, doctor_id, scheduled_time, notes]
  );
  return result.rows[0];
};

exports.getAppointmentsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT a.*, d.full_name AS doctor_name, d.specialization
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.doctor_id
     WHERE a.user_id = $1 ORDER BY scheduled_time DESC`,
    [user_id]
  );
  return result.rows;
};

exports.getAppointmentsByDoctor = async (doctor_id) => {
  const result = await db.query(
    `SELECT a.*, u.full_name AS user_name
     FROM appointments a
     JOIN users u ON a.user_id = u.user_id
     WHERE a.doctor_id = $1 ORDER BY scheduled_time DESC`,
    [doctor_id]
  );
  return result.rows;
};

exports.updateAppointmentStatus = async (appointment_id, status) => {
  const result = await db.query(
    `UPDATE appointments SET status = $1 WHERE appointment_id = $2 RETURNING *`,
    [status, appointment_id]
  );
  return result.rows[0];
};

