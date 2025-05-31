const pool = require('../config/database');



exports.createUser = async (user) => {
    const {email, password_hash, username, full_name} = user;

    const newUser = await pool.query(`INSERT INTO public.users (user_id, email, password_hash, username, full_name, is_verified, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, false, now()) RETURNING user_id, email, password_hash, username, role, full_name, is_verified, created_at`,
      [email, password_hash, username, full_name]);

      return newUser.rows[0];
}


exports.findUserbyEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users_public WHERE email = $1', [email])

    return result.rows[0];
}

exports.findUserById = async (user_id) => {
  const result = await pool.query('SELECT * FROM users_public WHERE user_id = $1', [user_id])

  return result.rows[0];
}

exports.getAllUsers = async () =>{
    const result = await pool.query('select * from users_public');
    
    return result.rows;
};


exports.verifyUser = async (user_id) => {
  try{
    const result = await pool.query('UPDATE public.users SET is_verified = true WHERE user_id = $1', [user_id]);
  } catch (err) {
    console.error('Error saat memverifikasi user:', err);
    throw err; 
  }
};
 

exports.deleteUser = async (user_id) => {
    await pool.query('DELETE FROM public.users WHERE user_id = $1', [user_id]);
}

exports.updateRole = async (role, user_id) => {
  await pool.query('UPDATE users SET role = $1 WHERE user_id = $2', [role, user_id]);
}



exports.checkRole = async (user_id) => {
  const result = await pool.query('SELECT role FROM public.users WHERE user_id = $1', [user_id])
  return result.rows[0];
}


exports.updateUserById = async (id, alamat, phone_number, tanggal_lahir) => {
  const updatedUser = await pool.query(
    `UPDATE users 
     SET alamat = $1, phone_number = $2, tanggal_lahir = $3
     WHERE user_id = $4`,
    [alamat, phone_number, tanggal_lahir, id]
  );
  return updatedUser.rows[0];
};

exports.updatePictById = async (user_id, avatar_url) =>{
  const updatedPict = await pool.query(`
    update users set avatar_url = $1 
    WHERE user_id = $2`, 
    [avatar_url, user_id]
  );
    return updatedPict.rows[0];
}

exports.saveResetToken = async (userId, token, expiresAt) => {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE user_id = $3',
    [token, expiresAt, userId]
  );
};

exports.findUserByResetToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
    [token]
  );
  return result.rows[0];
};

exports.updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = $2`,
    [hashedPassword, userId]
  );
};

exports.userLogin = async (email) =>{
  const result = await pool.query(`
    SELECT password_hash FROM users WHERE email= $1
  `, [email]);
  return result.rows[0];
};