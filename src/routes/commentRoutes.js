const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const {authenticateToken} = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, commentController.createComment);
router.get('/', commentController.getCommentsByForum);

module.exports = router;
