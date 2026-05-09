const postModel = require('../models/postModel');

exports.getPosts = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const post = await postModel.createPost({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    createdAt: req.body.createdAt
  });

  res.json(post);
};


exports.updatePost = async (req, res) => {
  const post = await postModel.updatePost(req.params.id, req.body);
  res.json(post);
};

exports.deletePost = async (req, res) => {
  await postModel.deletePost(req.params.id);
  res.json({ message: 'Deleted' });
};