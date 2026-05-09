const express = require('express');
const router = express.Router();

const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const auth = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;