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



