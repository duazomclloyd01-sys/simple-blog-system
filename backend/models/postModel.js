const axios = require('axios');

const API = 'http://localhost:3001/posts';

exports.getAllPosts = async () => {
  const res = await axios.get(API);
  return res.data;
};

exports.createPost = async (post) => {
  const res = await axios.post(API, post);
  return res.data;
};

exports.updatePost = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

exports.deletePost = async (id) => {
  await axios.delete(`${API}/${id}`);
};