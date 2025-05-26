const pool = require('../config/database');

// Buat forum baru
exports.createForum = async function ({ title, content, user_id }) {
  
  const result = await pool.query(
    'INSERT INTO public.forums (id, title, content, user_id) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
    [title, content, user_id]
  );
  return result.rows[0];
};

// Ambil semua forum dengan info user
exports.getAllForums = async function () {
  const result = await pool.query(`
    SELECT f.id, f.title, f.content, f.created_at,
           u.user_id, u.username, u.full_name, u.avatar_url
    FROM  public.forums f
    JOIN  public.users u ON f.user_id = u.user_id
    ORDER BY f.created_at DESC
  `);
  return result.rows;
};

// Ambil satu forum berdasarkan id
exports.getForumById = async function (forum_id) {
  const result = await pool.query(`
    SELECT f.id, f.title, f.content, f.created_at,
           u.user_id, u.username, u.full_name, u.avatar_url
    FROM  public.forums f
    JOIN  public.users u ON f.user_id = u.user_id
    WHERE f.id = $1
  `, [forum_id]);
  return result.rows[0];
};

exports.deleteForum = async function (forum_id) {
  await pool.query('DELETE FROM public.forums WHERE id = $1', [forum_id])
}

exports.getForumByUserId = async (user_id) => {
  const result = await pool.query('SELECT * FROM public.forums WHERE user_id = $1', [user_id]);
  return result.rows;
}
