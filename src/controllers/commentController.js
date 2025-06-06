const commentModel = require('../config/commentModel');

// POST /forums/:forumId/comments
exports.createComment = async (req, res) => {
  const { forumId } = req.params;
  const { parent_id, content } = req.body;
  const user_id = req.user.id;

  try {
    const comment = await commentModel.createComment({
      forum_id: forumId,
      parent_id,
      user_id,
      content
    });
    res.status(201).json({ comment });
  } catch (err) {
    console.error('Gagal membuat komentar:', err);
    res.status(500).json({ message: 'Gagal membuat komentar' });
  }
};

// GET /forums/:forumId/comments
exports.getCommentsByForum = async (req, res) => {
  const { forumId } = req.params;

  try {
    const comments = await commentModel.getCommentsByForumId(forumId);
    res.json({ comments });
  } catch (err) {
    console.error('Gagal mengambil komentar:', err);
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
};


exports.deleteComment = async (req, res) => {
  const {commentId} = req.params;

  if(!commentId) return res.status(404).json({ message: 'Komentar tidak ditemukan' });
  try {
    const comment = await commentModel.deleteComment(commentId);
    res.status(200).json({message: 'Berhasil menghapus Komentar', comment});
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus komentar', error});
  }
}
