const db = require('./database');

exports.createAppointment = async ({ user_id, doctor_id, hari, waktu, notes }) => {
  const result = await db.query(
    `INSERT INTO public.appointments (user_id, doctor_id, hari, waktu, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, doctor_id, hari, waktu, notes]
  );
  return result.rows[0];
};

exports.getAppointmentsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT a.*, d.full_name AS doctor_name, d.specialization
     FROM public.appointments a
     JOIN doctors d ON a.doctor_id = d.doctor_id
     WHERE a.user_id = $1 ORDER BY appointment_time DESC`,
    [user_id]
  );
  return result.rows;
};

exports.getAppointmentsByDoctor = async (doctor_id) => {
  const result = await db.query(
    `SELECT a.*, u.full_name AS name
     FROM public.appointments a
     JOIN users u ON a.user_id = u.user_id
     WHERE a.doctor_id = $1 ORDER BY appointment_time DESC`,
    [doctor_id]
  );
  return result.rows;
};

exports.updateAppointmentStatus = async (appointment_id, status) => {
  const result = await db.query(
    `UPDATE public.appointments SET status = $1 WHERE appointment_id = $2 RETURNING *`,
    [status, appointment_id]
  );
  return result.rows[0];
};

exports.getAllAppointments = async () => {
  const result = await db.query('SELECT * FROM public.appointments');
  return result.rows
}

