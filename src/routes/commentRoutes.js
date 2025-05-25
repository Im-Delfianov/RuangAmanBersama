const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const {authenticateToken, ifAdmin} = require('../middlewares/authMiddleware');
const { commentCharCounter } = require('../middlewares/charCounterMiddleware');

router.post('/', authenticateToken, commentCharCounter, commentController.createComment);
router.get('/', commentController.getCommentsByForum);
router.delete('/:commentId', authenticateToken, ifAdmin, commentController.deleteComment)

module.exports = router;
