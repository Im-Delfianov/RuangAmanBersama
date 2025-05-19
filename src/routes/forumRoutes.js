const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentRoutes = require('./commentRoutes');
const { authenticateToken } = require('../middlewares/authMiddleware');


// Endpoint forum
router.post('/', authenticateToken, forumController.createForum); // Buat forum (butuh login)
router.get('/', forumController.getAllForums);                    // Ambil semua forum
router.get('/:id', forumController.getForumById);                 // Ambil detail forum

router.use('/:forumId/comments', commentRoutes);

module.exports = router;
