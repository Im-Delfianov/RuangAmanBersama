const forumModel = require('../config/forumModel');

// POST /forums
exports.createForum = async function (req, res) {
  const { title, content } = req.body;
  const user_id = req.user.id;

  try {
    const forum = await forumModel.createForum({ title, content, user_id });
    res.status(201).json({ forum });
  } catch (err) {
    console.error('Gagal membuat forum:', err);
    res.status(500).json({ message: 'Gagal membuat forum' });
  }
};

// GET /forums
exports.getAllForums = async function (req, res) {
  try {
    const forums = await forumModel.getAllForums();
    res.json({ forums });
  } catch (err) {
    console.error('Gagal mengambil forum:', err);
    res.status(500).json({ message: 'Gagal mengambil forum' });
  }
};

// GET /forums/:id
exports.getForumById = async function (req, res) {
  const { id } = req.params;
  try {
    const forum = await forumModel.getForumById(id);
    if (!forum) return res.status(404).json({ message: 'Forum tidak ditemukan' });
    res.json({ forum });

  } catch (err) {
    console.error('Gagal mengambil forum:', err);
    res.status(500).json({ message: 'Gagal mengambil forum' });
  }
};

exports.deleteForumById = async function (req,res) {
  const {forumId} = req.params;

  if(!forumId) return res.status(404).json({ message: 'Forum tidak ditemukan' });

  try {
    await forumModel.deleteForum(forumId);
    res.status(200).json({message: 'berhasil menghapus forum'})
  } catch (error) {
    res.status(500).json({message: 'gagal menghapus forum', error});
  }
};

exports.getForumByUserId = async function (req, res) {
  const {user_id} = req.params;

  try {
    const forum = await forumModel.getForumByUserId(user_id);

    if(!forum) return res.status(404).json({ message: 'Forum tidak ditemukan' });

    res.status(200).json({forum});
  } catch (error) {
    res.status(500).json({message: 'gagal mengambil data forum', error});
  }
}
