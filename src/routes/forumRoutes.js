const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentRoutes = require('./commentRoutes');
const { authenticateToken, ifAdmin } = require('../middlewares/authMiddleware');
const { forumCharCounter } = require('../middlewares/charCounterMiddleware');


// Endpoint forum
router.post('/', authenticateToken, forumCharCounter, forumController.createForum); // Buat forum (butuh login)
router.get('/', forumController.getAllForums);                    // Ambil semua forum
router.get('/:id', forumController.getForumById);                 // Ambil detail forum

router.use('/:forumId/comments', commentRoutes);
router.delete('/:forumId', authenticateToken, ifAdmin, forumController.deleteForumById);

module.exports = router;
