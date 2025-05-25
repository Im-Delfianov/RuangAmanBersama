const pool = require('../config/database');



exports.createUser = async (user) => {
    const {email, password_hash, username, full_name} = user;

    const newUser = await pool.query(`INSERT INTO public.users (user_id, email, password_hash, username, full_name, is_verified, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, false, now()) RETURNING user_id, email, password_hash, username, role, full_name, is_verified, created_at`,
      [email, password_hash, username, full_name]);

      return newUser.rows[0];
}


exports.findUserbyEmail = async (email) => {
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email])

    return result.rows[0];
}

exports.findUserById = async (user_id) => {
  const result = await pool.query('SELECT * FROM public.users WHERE user_id = $1', [user_id])

  return result.rows[0];
}

exports.getAllUsers = async () =>{
    const result = await pool.query('select * from public.users');
    
    return result.rows;
};

exports.findUserByVerificationToken = async (token) => {
const result = await pool.query('SELECT * FROM public.users WHERE verification_token = $1', [token]);
return result.rows[0];
};

exports.verifyUser = async (user_id) => {
  try{
    const result = await pool.query('UPDATE public.users SET is_verified = true WHERE user_id = $1', [user_id]);
  return result.rowCount > 0;
  } catch (err) {
    console.error('Error saat memverifikasi user:', err);
    throw err; // biar bisa ditangani di controller
  }
};
 

exports.deleteUser = async (user_id) => {
    await pool.query('DELETE FROM public.users WHERE user_id = $1', [user_id]);
}



exports.checkRole = async (user_id) => {
  await pool.query('SELECT role FROM public.users WHERE user_id = $1', [user_id])
}


exports.updateUserById = async (id, alamat, phone_number, tanggal_lahir) => {
  await pool.query(
    `UPDATE users 
     SET alamat = $1, phone_number = $2, tanggal_lahir = $3 
     WHERE user_id = $4`,
    [alamat, phone_number, tanggal_lahir, id]
  );
};
