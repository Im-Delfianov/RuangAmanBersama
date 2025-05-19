const pool = require('../config/database');



exports.createUser = async (user) => {
    const {email, password_hash, username, full_name, avatar_url} = user;

    const newUser = await pool.query(`INSERT INTO public.users (user_id, email, password_hash, username, full_name, avatar_url, is_verified, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, now()) RETURNING user_id, email, password_hash, username, role, full_name, avatar_url, is_verified, created_at`,
      [email, password_hash, username, full_name, avatar_url]);

      return newUser.rows[0];
}


exports.findUserbyEmail = async (email) => {
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email])

    return result.rows[0];
}

exports.getAllUsers = async (req, res) =>{
    try {
    const result = await pool.query('select * from public.users');
    res.json(result.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

 
