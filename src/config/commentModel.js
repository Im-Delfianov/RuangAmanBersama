const pool = require('../config/database');

// Buat komentar baru
async function createComment({ forum_id, parent_id = null, user_id, content }) {
  const result = await pool.query(
    `INSERT INTO public.comments (comment_id, forum_id, parent_id, user_id, content)
     VALUES (gen_random_uuid(), $1, $2, $3, $4)
     RETURNING *`,
    [forum_id, parent_id, user_id, content]
  );
  return result.rows[0];
}

// Ambil komentar berdasarkan forum_id (tanpa nested, untuk versi awal)
async function getCommentsByForumId(forum_id) {
  const result = await pool.query(`
    SELECT c.comment_id, c.content, c.created_at, c.parent_id,
           u.username, u.full_name, u.avatar_url
    FROM public.comments c
    JOIN public.users u ON c.user_id = u.user_id
    WHERE c.forum_id = $1
    ORDER BY c.created_at ASC
  `, [forum_id]);

  return result.rows;
}

async function getCommentsByCommentId(comment_id) {
    const result = await pool.query(`SELECT * FROM public.comment WHERE comment_id = $1`, [comment_id]);
    
}

async function getCommentsByUserId(user_id) {
  const result = await pool.query(`
    SELECT c.comment_id, c.content, c.created_at, c.parent_id, u.username, u.full_name, u.avatar_url
    FROM public.comments c
    JOIN public.users u on c.user_id = u.user_id
    where c.user_id = $1
    ORDER BY c.created_at ASC
    `, [user_id]);
}

async function deleteComment(comment_id) {
  const result = await pool.query('DELETE FROM public.comments WHERE comment_id = $1', [comment_id])
}

module.exports = {
    createComment,
    getCommentsByForumId,
    getCommentsByCommentId,
    getCommentsByUserId,
    deleteComment
};
